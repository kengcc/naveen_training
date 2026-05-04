import { randomUUID } from 'node:crypto';
import { ValidationError } from './errors.js';
import { calculateInclusiveDays, formatDateKey } from './date.js';

const ALLOWED_STATUSES = new Set(['draft', 'pending', 'approved', 'rejected', 'cancelled']);
const TRANSITION_TARGETS = new Set(['approved', 'rejected', 'cancelled']);

function assertAllowedStatus(status) {
  if (!ALLOWED_STATUSES.has(status)) {
    throw new ValidationError(`Unsupported request status: ${status}`);
  }
}

function assertTransitionTarget(status) {
  if (!TRANSITION_TARGETS.has(status)) {
    throw new ValidationError(`Unsupported request transition: ${status}`);
  }
}

export function createHolidayRequest(command) {
  if (command === undefined) {
    command = {};
  }

  const {
    id = `holiday-request-${randomUUID()}`,
    userId,
    startDate,
    endDate,
    reason,
    status = 'pending',
    approverId = null,
    decisionNote = null,
    approvedAt = null,
    rejectedAt = null,
    cancelledAt = null,
    createdAt = new Date(),
    updatedAt = createdAt
  } = command;

  if (!userId) {
    throw new ValidationError('userId is required');
  }

  const normalizedReason = String(reason ?? '').trim();

  if (!normalizedReason) {
    throw new ValidationError('reason is required');
  }

  assertAllowedStatus(status);

  const normalizedStartDate = formatDateKey(startDate, 'startDate');
  const normalizedEndDate = formatDateKey(endDate, 'endDate');

  return Object.freeze({
    id,
    userId,
    startDate: normalizedStartDate,
    endDate: normalizedEndDate,
    daysRequested: calculateInclusiveDays(startDate, endDate),
    reason: normalizedReason,
    status,
    approverId,
    decisionNote,
    approvedAt,
    rejectedAt,
    cancelledAt,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
  });
}

export function applyRequestStatusChange(request, status, command) {
  if (command === undefined) {
    command = {};
  }

  if (!request) {
    throw new ValidationError('request is required');
  }

  const { actorId, note = '', timestamp } = command;

  if (!actorId) {
    throw new ValidationError('actorId is required');
  }

  assertTransitionTarget(status);

  if (request.status !== 'pending') {
    throw new ValidationError('Only pending requests can change status');
  }

  const decisionNote = String(note).trim();

  if (status === 'approved') {
    return {
      ...request,
      status,
      approverId: actorId,
      decisionNote,
      approvedAt: timestamp,
      rejectedAt: null,
      cancelledAt: null,
      updatedAt: timestamp
    };
  }

  if (status === 'rejected') {
    return {
      ...request,
      status,
      approverId: actorId,
      decisionNote,
      approvedAt: null,
      rejectedAt: timestamp,
      cancelledAt: null,
      updatedAt: timestamp
    };
  }

  return {
    ...request,
    status,
    approverId: actorId,
    decisionNote,
    approvedAt: null,
    rejectedAt: null,
    cancelledAt: timestamp,
    updatedAt: timestamp
  };
}
