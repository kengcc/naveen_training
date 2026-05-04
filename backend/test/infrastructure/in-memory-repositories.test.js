import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryAuditLogRepository } from '../../src/infrastructure/memory/in-memory-audit-log-repository.js';
import { InMemoryHolidayRequestRepository } from '../../src/infrastructure/memory/in-memory-holiday-request-repository.js';
import { InMemoryLeaveBalanceRepository } from '../../src/infrastructure/memory/in-memory-leave-balance-repository.js';
import { InMemoryNotificationRepository } from '../../src/infrastructure/memory/in-memory-notification-repository.js';

test('InMemoryHolidayRequestRepository stores and queries requests', async () => {
  const repository = new InMemoryHolidayRequestRepository([
    {
      id: 'r1',
      userId: 'user-1',
      status: 'pending'
    }
  ]);

  const saved = await repository.save({
    id: 'r2',
    userId: 'user-1',
    status: 'approved'
  });

  assert.equal(saved.id, 'r2');
  assert.equal((await repository.findById('r1')).id, 'r1');
  assert.equal((await repository.findById('missing')), null);
  assert.equal((await repository.listByUserId('user-1')).length, 2);
  assert.equal((await repository.listPending()).length, 1);
});

test('InMemoryLeaveBalanceRepository stores and queries balances', async () => {
  const repository = new InMemoryLeaveBalanceRepository([
    {
      userId: 'user-1',
      year: 2026,
      entitlementDays: 24,
      usedDays: 2,
      pendingDays: 1,
      remainingDays: 21
    }
  ]);

  const saved = await repository.save({
    userId: 'user-2',
    year: 2026,
    entitlementDays: 24,
    usedDays: 0,
    pendingDays: 0,
    remainingDays: 24
  });

  assert.equal(saved.userId, 'user-2');
  assert.equal((await repository.findByUserIdAndYear('user-1', 2026)).remainingDays, 21);
  assert.equal((await repository.findByUserIdAndYear('missing', 2026)), null);
  assert.equal((await repository.listByUserId('user-2')).length, 1);
});

test('InMemoryAuditLogRepository records entries and fills timestamps', async () => {
  const repository = new InMemoryAuditLogRepository();

  const first = await repository.record({
    actorId: 'user-1',
    action: 'CREATED',
    entityType: 'HolidayRequest',
    entityId: 'r1',
    metadata: {}
  });
  const second = await repository.record({
    actorId: 'user-1',
    action: 'UPDATED',
    entityType: 'HolidayRequest',
    entityId: 'r2',
    metadata: {},
    createdAt: '2026-05-04T10:00:00.000Z'
  });

  assert.match(first.createdAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(second.createdAt, '2026-05-04T10:00:00.000Z');
  assert.equal((await repository.all()).length, 2);
});

test('InMemoryNotificationRepository records notifications and fills timestamps', async () => {
  const repository = new InMemoryNotificationRepository();

  const first = await repository.record({
    userId: 'user-1',
    title: 'Approved',
    message: 'Approved'
  });
  const second = await repository.record({
    userId: 'user-1',
    title: 'Rejected',
    message: 'Rejected',
    createdAt: '2026-05-04T10:00:00.000Z'
  });

  assert.match(first.createdAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(second.createdAt, '2026-05-04T10:00:00.000Z');
  assert.equal((await repository.all()).length, 2);
});
