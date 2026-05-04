import { NotFoundError, ValidationError } from '../domain/errors.js';
import { applyRequestStatusChange, createHolidayRequest } from '../domain/holiday-request.js';
import {
  approvePendingLeave,
  createLeaveBalance,
  releasePendingLeave,
  reservePendingLeave
} from '../domain/leave-balance.js';

function assertRepository(name, repository, methods) {
  if (!repository) {
    throw new ValidationError(`${name} is required`);
  }

  for (const method of methods) {
    if (typeof repository[method] !== 'function') {
      throw new ValidationError(`${name}.${method} must be a function`);
    }
  }
}

function getYearKey(dateKey) {
  return Number(dateKey.slice(0, 4));
}

function buildStatusMetadata(status, request) {
  if (status === 'approved') {
    return {
      action: 'HOLIDAY_REQUEST_APPROVED',
      title: 'Holiday request approved',
      message: `Your holiday request for ${request.startDate} to ${request.endDate} has been approved.`
    };
  }

  if (status === 'rejected') {
    return {
      action: 'HOLIDAY_REQUEST_REJECTED',
      title: 'Holiday request rejected',
      message: `Your holiday request for ${request.startDate} to ${request.endDate} has been rejected.`
    };
  }

  return {
    action: 'HOLIDAY_REQUEST_CANCELLED',
    title: 'Holiday request cancelled',
    message: `Your holiday request for ${request.startDate} to ${request.endDate} has been cancelled.`
  };
}

export function createHolidayPlannerService(deps = {}) {
  const {
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository,
    clock = () => new Date(),
    defaultEntitlementDays = 24
  } = deps;

  assertRepository('holidayRequestRepository', holidayRequestRepository, [
    'save',
    'findById',
    'listByUserId',
    'listPending'
  ]);
  assertRepository('leaveBalanceRepository', leaveBalanceRepository, [
    'findByUserIdAndYear',
    'save'
  ]);
  assertRepository('auditLogRepository', auditLogRepository, ['record']);
  assertRepository('notificationRepository', notificationRepository, ['record']);

  async function ensureLeaveBalance(userId, year) {
    const existingBalance = await leaveBalanceRepository.findByUserIdAndYear(userId, year);

    if (existingBalance) {
      return existingBalance;
    }

    return createLeaveBalance({
      userId,
      year,
      entitlementDays: defaultEntitlementDays
    });
  }

  async function recordAudit(actorId, action, entityId, metadata = {}) {
    await auditLogRepository.record({
      actorId,
      action,
      entityType: 'HolidayRequest',
      entityId,
      metadata,
      createdAt: clock().toISOString()
    });
  }

  async function notifyUser(userId, title, message) {
    await notificationRepository.record({
      userId,
      title,
      message,
      readAt: null,
      createdAt: clock().toISOString()
    });
  }

  async function createRequest(command = {}) {
    const request = createHolidayRequest({
      ...command,
      status: 'pending',
      createdAt: clock()
    });
    const year = getYearKey(request.startDate);
    const balance = await ensureLeaveBalance(request.userId, year);
    const updatedBalance = reservePendingLeave(balance, request.daysRequested);

    await leaveBalanceRepository.save(updatedBalance);
    await holidayRequestRepository.save(request);
    await recordAudit(command.actorId ?? request.userId, 'HOLIDAY_REQUEST_CREATED', request.id, {
      daysRequested: request.daysRequested
    });

    return request;
  }

  async function changeRequestStatus(command = {}, nextStatus) {
    const { requestId, actorId, note = '' } = command;

    if (!requestId) {
      throw new ValidationError('requestId is required');
    }

    if (!actorId) {
      throw new ValidationError('actorId is required');
    }

    const request = await holidayRequestRepository.findById(requestId);

    if (!request) {
      throw new NotFoundError(`Holiday request ${requestId} was not found`);
    }

    const updatedRequest = applyRequestStatusChange(request, nextStatus, {
      actorId,
      note,
      timestamp: clock().toISOString()
    });
    const year = getYearKey(updatedRequest.startDate);
    const balance = await ensureLeaveBalance(updatedRequest.userId, year);

    let updatedBalance = balance;

    if (nextStatus === 'approved') {
      updatedBalance = approvePendingLeave(balance, updatedRequest.daysRequested);
    } else if (nextStatus === 'rejected') {
      updatedBalance = releasePendingLeave(balance, updatedRequest.daysRequested);
    } else {
      updatedBalance = releasePendingLeave(balance, updatedRequest.daysRequested);
    }

    await leaveBalanceRepository.save(updatedBalance);
    await holidayRequestRepository.save(updatedRequest);

    const { action, title, message } = buildStatusMetadata(nextStatus, updatedRequest);

    await recordAudit(actorId, action, updatedRequest.id, {
      requestId: updatedRequest.id,
      status: nextStatus
    });
    await notifyUser(updatedRequest.userId, title, message);

    return updatedRequest;
  }

  async function approveRequest(command = {}) {
    return changeRequestStatus(command, 'approved');
  }

  async function rejectRequest(command = {}) {
    return changeRequestStatus(command, 'rejected');
  }

  async function cancelRequest(command = {}) {
    return changeRequestStatus(command, 'cancelled');
  }

  async function listRequestsByUser(userId) {
    if (!userId) {
      throw new ValidationError('userId is required');
    }

    return holidayRequestRepository.listByUserId(userId);
  }

  async function listPendingRequests() {
    return holidayRequestRepository.listPending();
  }

  return Object.freeze({
    createRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    listRequestsByUser,
    listPendingRequests
  });
}
