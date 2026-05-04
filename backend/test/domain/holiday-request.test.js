import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyRequestStatusChange,
  createHolidayRequest
} from '../../src/domain/holiday-request.js';

const baseRequestCommand = {
  userId: 'user-1',
  startDate: '2026-06-10',
  endDate: '2026-06-12',
  reason: 'Family trip'
};

test('createHolidayRequest normalizes and freezes the request', () => {
  const request = createHolidayRequest(baseRequestCommand);

  assert.equal(request.userId, 'user-1');
  assert.equal(request.startDate, '2026-06-10');
  assert.equal(request.endDate, '2026-06-12');
  assert.equal(request.daysRequested, 3);
  assert.equal(request.status, 'pending');
  assert.ok(request.id.startsWith('holiday-request-'));
  assert.ok(Object.isFrozen(request));
});

test('createHolidayRequest accepts explicit statuses and trims the reason', () => {
  const request = createHolidayRequest({
    ...baseRequestCommand,
    status: 'draft',
    reason: '  Team offsite  '
  });

  assert.equal(request.status, 'draft');
  assert.equal(request.reason, 'Team offsite');
});

test('createHolidayRequest preserves explicit identifiers and timestamps', () => {
  const request = createHolidayRequest({
    ...baseRequestCommand,
    id: 'holiday-request-fixed',
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-02T00:00:00.000Z')
  });

  assert.equal(request.id, 'holiday-request-fixed');
  assert.equal(request.createdAt, '2026-05-01T00:00:00.000Z');
  assert.equal(request.updatedAt, '2026-05-02T00:00:00.000Z');
});

test('createHolidayRequest rejects invalid payloads', () => {
  assert.throws(() => createHolidayRequest(), /userId is required/);
  assert.throws(
    () => createHolidayRequest({ ...baseRequestCommand, reason: '   ' }),
    /reason is required/
  );
  assert.throws(
    () => createHolidayRequest({ ...baseRequestCommand, userId: '' }),
    /userId is required/
  );
  assert.throws(
    () => createHolidayRequest({ ...baseRequestCommand, status: 'unknown' }),
    /Unsupported request status/
  );
});

test('applyRequestStatusChange handles approval, rejection, and cancellation', () => {
  const request = createHolidayRequest(baseRequestCommand);

  const approved = applyRequestStatusChange(request, 'approved', {
    actorId: 'manager-1',
    note: 'Approved',
    timestamp: '2026-05-04T10:00:00.000Z'
  });
  const approvedWithoutNote = applyRequestStatusChange(request, 'approved', {
    actorId: 'manager-5',
    note: '   ',
    timestamp: '2026-05-04T10:00:00.000Z'
  });
  const rejected = applyRequestStatusChange(request, 'rejected', {
    actorId: 'manager-2',
    note: 'Rejected',
    timestamp: '2026-05-04T10:00:00.000Z'
  });
  const cancelled = applyRequestStatusChange(request, 'cancelled', {
    actorId: 'user-1',
    note: 'Cancelled',
    timestamp: '2026-05-04T10:00:00.000Z'
  });

  assert.equal(approved.status, 'approved');
  assert.equal(approved.approverId, 'manager-1');
  assert.equal(approved.approvedAt, '2026-05-04T10:00:00.000Z');
  assert.equal(approvedWithoutNote.decisionNote, '');
  assert.equal(rejected.status, 'rejected');
  assert.equal(rejected.rejectedAt, '2026-05-04T10:00:00.000Z');
  assert.equal(cancelled.status, 'cancelled');
  assert.equal(cancelled.cancelledAt, '2026-05-04T10:00:00.000Z');
});

test('applyRequestStatusChange rejects unsupported transitions', () => {
  const request = createHolidayRequest(baseRequestCommand);
  const approved = applyRequestStatusChange(request, 'approved', {
    actorId: 'manager-1'
  });

  assert.throws(
    () =>
      applyRequestStatusChange(request, 'approved'),
    /actorId is required/
  );
  assert.throws(
    () =>
      applyRequestStatusChange(request, 'approved', {
        timestamp: '2026-05-04T10:00:00.000Z'
      }),
    /actorId is required/
  );
  assert.throws(
    () =>
      applyRequestStatusChange(null, 'approved', {
        actorId: 'manager-1',
        timestamp: '2026-05-04T10:00:00.000Z'
      }),
    /request is required/
  );
  assert.throws(
    () =>
      applyRequestStatusChange(request, 'pending', {
        actorId: 'manager-1'
      }),
    /Unsupported request transition/
  );
  assert.throws(
    () =>
      applyRequestStatusChange(approved, 'rejected', {
        actorId: 'manager-1'
      }),
    /Only pending requests can change status/
  );
  assert.throws(
    () =>
      applyRequestStatusChange(request, 'approved', {
        note: 'missing actor'
      }),
    /actorId is required/
  );
});
