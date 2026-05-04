import test from 'node:test';
import assert from 'node:assert/strict';
import { ValidationError, NotFoundError } from '../../src/domain/errors.js';
import { createHolidayPlannerService } from '../../src/application/holiday-planner.service.js';
import { InMemoryAuditLogRepository } from '../../src/infrastructure/memory/in-memory-audit-log-repository.js';
import { InMemoryHolidayRequestRepository } from '../../src/infrastructure/memory/in-memory-holiday-request-repository.js';
import { InMemoryLeaveBalanceRepository } from '../../src/infrastructure/memory/in-memory-leave-balance-repository.js';
import { InMemoryNotificationRepository } from '../../src/infrastructure/memory/in-memory-notification-repository.js';

function createService(seed = {}) {
  const clock = () => new Date('2026-05-04T10:00:00.000Z');

  const holidayRequestRepository = new InMemoryHolidayRequestRepository(seed.holidayRequests);
  const leaveBalanceRepository = new InMemoryLeaveBalanceRepository(seed.leaveBalances);
  const auditLogRepository = new InMemoryAuditLogRepository(seed.auditLogs);
  const notificationRepository = new InMemoryNotificationRepository(seed.notifications);
  const service = createHolidayPlannerService({
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository,
    clock
  });

  return {
    service,
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository
  };
}

test('createHolidayPlannerService validates dependencies', () => {
  assert.throws(() => createHolidayPlannerService(), /holidayRequestRepository is required/);
  assert.throws(
    () =>
      createHolidayPlannerService({
        holidayRequestRepository: {},
        leaveBalanceRepository: {},
        auditLogRepository: {},
        notificationRepository: {}
      }),
    /holidayRequestRepository.save must be a function/
  );
});

test('createRequest reserves leave and writes audit entries', async () => {
  const { service, leaveBalanceRepository, auditLogRepository, notificationRepository } = createService();

  const request = await service.createRequest({
    userId: 'user-1',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    reason: 'Family trip'
  });

  assert.equal(request.status, 'pending');
  assert.equal(request.daysRequested, 3);
  assert.equal(request.createdAt, '2026-05-04T10:00:00.000Z');

  const balance = await leaveBalanceRepository.findByUserIdAndYear('user-1', 2026);
  assert.equal(balance.pendingDays, 3);
  assert.equal(balance.remainingDays, 21);
  assert.deepEqual((await auditLogRepository.all()).map((item) => item.action), [
    'HOLIDAY_REQUEST_CREATED'
  ]);
  assert.equal((await notificationRepository.all()).length, 0);
});

test('createRequest works with the default system clock', async () => {
  const holidayRequestRepository = new InMemoryHolidayRequestRepository();
  const leaveBalanceRepository = new InMemoryLeaveBalanceRepository();
  const auditLogRepository = new InMemoryAuditLogRepository();
  const notificationRepository = new InMemoryNotificationRepository();
  const service = createHolidayPlannerService({
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository
  });

  const request = await service.createRequest({
    userId: 'user-3',
    startDate: '2026-09-10',
    endDate: '2026-09-10',
    reason: 'Personal day'
  });

  assert.equal(request.status, 'pending');
  assert.match(request.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test('holiday request lifecycle updates balances, audit logs, and notifications', async () => {
  const holidayRequestRepository = new InMemoryHolidayRequestRepository();
  const leaveBalanceRepository = new InMemoryLeaveBalanceRepository();
  const auditLogRepository = new InMemoryAuditLogRepository();
  const notificationRepository = new InMemoryNotificationRepository();

  const service = createHolidayPlannerService({
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository,
    clock: () => new Date('2026-05-04T10:00:00.000Z')
  });

  const pendingA = await service.createRequest({
    userId: 'user-1',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    reason: 'Family trip'
  });
  const pendingB = await service.createRequest({
    userId: 'user-1',
    startDate: '2026-07-01',
    endDate: '2026-07-02',
    reason: 'Conference'
  });
  const pendingC = await service.createRequest({
    userId: 'user-2',
    startDate: '2026-08-10',
    endDate: '2026-08-10',
    reason: 'Personal day'
  });
  const approved = await service.approveRequest({
    requestId: pendingA.id,
    actorId: 'manager-1',
    note: 'Approved'
  });
  const rejected = await service.rejectRequest({
    requestId: pendingB.id,
    actorId: 'manager-2',
    note: 'Rejected'
  });
  const cancelled = await service.cancelRequest({
    requestId: pendingC.id,
    actorId: 'user-2',
    note: 'Cancelled'
  });

  assert.equal(approved.status, 'approved');
  assert.equal(rejected.status, 'rejected');
  assert.equal(cancelled.status, 'cancelled');

  const balanceUser1 = await leaveBalanceRepository.findByUserIdAndYear('user-1', 2026);
  const balanceUser2 = await leaveBalanceRepository.findByUserIdAndYear('user-2', 2026);

  assert.equal(balanceUser1.usedDays, 3);
  assert.equal(balanceUser1.pendingDays, 0);
  assert.equal(balanceUser2.pendingDays, 0);

  const allAudits = await auditLogRepository.all();
  const allNotifications = await notificationRepository.all();

  assert.deepEqual(
    allAudits.map((item) => item.action),
    ['HOLIDAY_REQUEST_CREATED', 'HOLIDAY_REQUEST_CREATED', 'HOLIDAY_REQUEST_CREATED', 'HOLIDAY_REQUEST_APPROVED', 'HOLIDAY_REQUEST_REJECTED', 'HOLIDAY_REQUEST_CANCELLED']
  );
  assert.deepEqual(
    allNotifications.map((item) => item.title),
    ['Holiday request approved', 'Holiday request rejected', 'Holiday request cancelled']
  );

  const requestsByUser1 = await service.listRequestsByUser('user-1');
  const pendingRequests = await service.listPendingRequests();

  assert.equal(requestsByUser1.length, 2);
  assert.equal(pendingRequests.length, 0);
});

test('holiday request lifecycle rejects invalid transitions and missing resources', async () => {
  const { service } = createService();

  await assert.rejects(() => service.listRequestsByUser(''), ValidationError);
  await assert.rejects(() => service.approveRequest({}), ValidationError);
  await assert.rejects(
    () =>
      service.approveRequest({
        requestId: 'missing'
      }),
    /actorId is required/
  );
  await assert.rejects(
    () =>
      service.approveRequest({
        requestId: 'missing',
        actorId: 'manager-1'
      }),
    NotFoundError
  );

  const request = await service.createRequest({
    userId: 'user-1',
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    reason: 'Family trip'
  });

  await service.approveRequest({
    requestId: request.id,
    actorId: 'manager-1'
  });

  await assert.rejects(
    () =>
      service.rejectRequest({
        requestId: request.id,
        actorId: 'manager-2'
      }),
    /Only pending requests can change status/
  );
});
