import { ValidationError } from './errors.js';

function assertInteger(name, value, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new ValidationError(`${name} must be an integer greater than or equal to ${minimum}`);
  }
}

function snapshot(balance) {
  return Object.freeze({
    ...balance,
    remainingDays: balance.entitlementDays - balance.usedDays - balance.pendingDays
  });
}

export function createLeaveBalance(command = {}) {
  const {
    userId,
    year,
    entitlementDays = 24,
    usedDays = 0,
    pendingDays = 0
  } = command;

  if (!userId) {
    throw new ValidationError('userId is required');
  }

  assertInteger('year', year, 2000);
  assertInteger('entitlementDays', entitlementDays, 0);
  assertInteger('usedDays', usedDays, 0);
  assertInteger('pendingDays', pendingDays, 0);

  if (entitlementDays < usedDays + pendingDays) {
    throw new ValidationError('Leave balance cannot be negative');
  }

  return snapshot({
    userId,
    year,
    entitlementDays,
    usedDays,
    pendingDays
  });
}

export function reservePendingLeave(balance, daysRequested) {
  assertInteger('daysRequested', daysRequested, 1);

  if (balance.remainingDays < daysRequested) {
    throw new ValidationError('Not enough leave balance');
  }

  return snapshot({
    ...balance,
    pendingDays: balance.pendingDays + daysRequested
  });
}

export function approvePendingLeave(balance, daysRequested) {
  assertInteger('daysRequested', daysRequested, 1);

  if (balance.pendingDays < daysRequested) {
    throw new ValidationError('Pending leave is insufficient');
  }

  return snapshot({
    ...balance,
    pendingDays: balance.pendingDays - daysRequested,
    usedDays: balance.usedDays + daysRequested
  });
}

export function releasePendingLeave(balance, daysRequested) {
  assertInteger('daysRequested', daysRequested, 1);

  if (balance.pendingDays < daysRequested) {
    throw new ValidationError('Pending leave is insufficient');
  }

  return snapshot({
    ...balance,
    pendingDays: balance.pendingDays - daysRequested
  });
}
