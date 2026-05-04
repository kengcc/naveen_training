import test from 'node:test';
import assert from 'node:assert/strict';
import {
  approvePendingLeave,
  createLeaveBalance,
  releasePendingLeave,
  reservePendingLeave
} from '../../src/domain/leave-balance.js';

test('createLeaveBalance returns a normalized snapshot', () => {
  const balance = createLeaveBalance({
    userId: 'user-1',
    year: 2026,
    entitlementDays: 24,
    usedDays: 4,
    pendingDays: 2
  });

  assert.equal(balance.remainingDays, 18);
  assert.ok(Object.isFrozen(balance));
});

test('createLeaveBalance rejects invalid inputs', () => {
  assert.throws(
    () =>
      createLeaveBalance({
        userId: 'user-1',
        year: 1999
      }),
    /year must be an integer greater than or equal to 2000/
  );
  assert.throws(
    () =>
      createLeaveBalance({
        userId: '',
        year: 2026
      }),
    /userId is required/
  );
  assert.throws(
    () =>
      createLeaveBalance({
        userId: 'user-1',
        year: 2026,
        entitlementDays: 4,
        usedDays: 3,
        pendingDays: 2
      }),
    /Leave balance cannot be negative/
  );
});

test('reservePendingLeave increases pending days and protects capacity', () => {
  const balance = createLeaveBalance({
    userId: 'user-1',
    year: 2026,
    entitlementDays: 24
  });
  const reserved = reservePendingLeave(balance, 5);

  assert.equal(reserved.pendingDays, 5);
  assert.equal(reserved.remainingDays, 19);
  assert.throws(() => reservePendingLeave(balance, 0), /daysRequested must be an integer greater than or equal to 1/);
  assert.throws(() => reservePendingLeave(balance, 25), /Not enough leave balance/);
});

test('approvePendingLeave and releasePendingLeave rebalance pending days', () => {
  const balance = createLeaveBalance({
    userId: 'user-1',
    year: 2026,
    entitlementDays: 24,
    pendingDays: 5
  });

  const approved = approvePendingLeave(balance, 3);
  const released = releasePendingLeave(balance, 2);

  assert.equal(approved.usedDays, 3);
  assert.equal(approved.pendingDays, 2);
  assert.equal(released.pendingDays, 3);
  assert.throws(() => approvePendingLeave(balance, 6), /Pending leave is insufficient/);
  assert.throws(() => releasePendingLeave(balance, 6), /Pending leave is insufficient/);
});
