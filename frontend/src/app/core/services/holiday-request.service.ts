import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateHolidayRequestCommand,
  HolidayRequest,
  UpdateHolidayRequestStatusCommand
} from '../models/holiday-request.model';
import { LeaveBalance } from '../models/leave-balance.model';
import { DashboardSummary } from '../models/dashboard-summary.model';
import { ApprovalHistory } from '../models/approval-history.model';
import { Notification } from '../models/notification.model';
import { AuditLog } from '../models/audit-log.model';

const currentYear = new Date().getFullYear();

const INITIAL_REQUESTS: HolidayRequest[] = [
  {
    id: 'hr-1001',
    userId: 'u-100',
    userName: 'Nadia Rahman',
    team: 'Platform',
    startDate: `${currentYear}-06-10`,
    endDate: `${currentYear}-06-12`,
    daysRequested: 3,
    reason: 'Family holiday',
    status: 'approved',
    approverId: 'u-200',
    decisionNote: 'Approved for overlap coverage',
    approvedAt: `${currentYear}-03-18T10:00:00.000Z`,
    createdAt: `${currentYear}-03-15T09:00:00.000Z`,
    updatedAt: `${currentYear}-03-18T10:00:00.000Z`
  },
  {
    id: 'hr-1002',
    userId: 'u-100',
    userName: 'Nadia Rahman',
    team: 'Platform',
    startDate: `${currentYear}-08-01`,
    endDate: `${currentYear}-08-03`,
    daysRequested: 3,
    reason: 'Short break',
    status: 'pending',
    createdAt: `${currentYear}-04-22T09:00:00.000Z`,
    updatedAt: `${currentYear}-04-22T09:00:00.000Z`
  }
];

const INITIAL_BALANCES: LeaveBalance[] = [
  {
    userId: 'u-100',
    year: currentYear,
    entitlementDays: 24,
    usedDays: 3,
    pendingDays: 3,
    remainingDays: 18
  }
];

@Injectable()
export class HolidayRequestService {
  private readonly requestsSubject = new BehaviorSubject<HolidayRequest[]>(INITIAL_REQUESTS);
  private readonly balancesSubject = new BehaviorSubject<LeaveBalance[]>(INITIAL_BALANCES);
  private readonly approvalsSubject = new BehaviorSubject<ApprovalHistory[]>([]);
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private readonly auditLogsSubject = new BehaviorSubject<AuditLog[]>([]);

  readonly requests$ = this.requestsSubject.asObservable();
  readonly balances$ = this.balancesSubject.asObservable();
  readonly approvals$ = this.approvalsSubject.asObservable();
  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly auditLogs$ = this.auditLogsSubject.asObservable();

  listRequestsForUser(userId: string): Observable<HolidayRequest[]> {
    return this.requests$.pipe(map((requests) => requests.filter((request) => request.userId === userId)));
  }

  listPendingRequests(): Observable<HolidayRequest[]> {
    return this.requests$.pipe(map((requests) => requests.filter((request) => request.status === 'pending')));
  }

  createRequest(command: CreateHolidayRequestCommand): Observable<HolidayRequest> {
    const now = new Date().toISOString();
    const nextRequest: HolidayRequest = {
      id: `hr-${Date.now()}`,
      userId: command.userId,
      startDate: command.startDate,
      endDate: command.endDate,
      daysRequested: this.countDays(command.startDate, command.endDate),
      reason: command.reason,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    this.requestsSubject.next([...this.requestsSubject.value, nextRequest]);
    this.appendAudit('HOLIDAY_REQUEST_CREATED', 'HolidayRequest', nextRequest.id, {
      userId: command.userId
    });

    return of(nextRequest);
  }

  updateRequestStatus(
    command: UpdateHolidayRequestStatusCommand,
    status: 'approved' | 'rejected' | 'cancelled'
  ): Observable<HolidayRequest> {
    const nextRequests = this.requestsSubject.value.map((request) => {
      if (request.id !== command.requestId) {
        return request;
      }

      const timestamp = new Date().toISOString();
      const updated: HolidayRequest = {
        ...request,
        status,
        approverId: command.actorId,
        decisionNote: command.note?.trim() || null,
        approvedAt: status === 'approved' ? timestamp : request.approvedAt ?? null,
        rejectedAt: status === 'rejected' ? timestamp : request.rejectedAt ?? null,
        cancelledAt: status === 'cancelled' ? timestamp : request.cancelledAt ?? null,
        updatedAt: timestamp
      };

      this.appendApproval(updated.id, command.actorId, status, command.note);
      this.appendNotification(updated.userId, this.buildNotificationTitle(status), this.buildNotificationMessage(updated, status));
      this.appendAudit(`HOLIDAY_REQUEST_${status.toUpperCase()}`, 'HolidayRequest', updated.id, {
        requestId: updated.id,
        status
      });
      this.rebalanceBalance(updated, status);

      return updated;
    });

    this.requestsSubject.next(nextRequests);
    const updatedRequest = nextRequests.find((request) => request.id === command.requestId);

    if (!updatedRequest) {
      throw new Error(`Request ${command.requestId} not found`);
    }

    return of(updatedRequest);
  }

  getLeaveBalance(userId: string): Observable<LeaveBalance | null> {
    return this.balances$.pipe(map((balances) => balances.find((balance) => balance.userId === userId) ?? null));
  }

  getDashboardSummary(userId: string): Observable<DashboardSummary> {
    return of(this.buildSummary(userId));
  }

  getTeamAbsences(team: string): Observable<HolidayRequest[]> {
    return this.requests$.pipe(map((requests) => requests.filter((request) => request.team === team)));
  }

  private rebalanceBalance(request: HolidayRequest, status: 'approved' | 'rejected' | 'cancelled'): void {
    const balances = this.balancesSubject.value.slice();
    const index = balances.findIndex((balance) => balance.userId === request.userId);

    if (index === -1) {
      return;
    }

    const next = { ...balances[index] };

    if (status === 'approved') {
      next.pendingDays = Math.max(0, next.pendingDays - request.daysRequested);
      next.usedDays += request.daysRequested;
    } else {
      next.pendingDays = Math.max(0, next.pendingDays - request.daysRequested);
    }

    next.remainingDays = next.entitlementDays - next.usedDays - next.pendingDays;
    balances[index] = next;
    this.balancesSubject.next(balances);
  }

  private buildSummary(userId: string): DashboardSummary {
    const userRequests = this.requestsSubject.value.filter((request) => request.userId === userId);
    const balance = this.balancesSubject.value.find((item) => item.userId === userId);

    return {
      upcomingLeaveDays: userRequests
        .filter((request) => request.status === 'approved')
        .reduce((total, request) => total + request.daysRequested, 0),
      pendingRequests: userRequests.filter((request) => request.status === 'pending').length,
      approvedRequests: userRequests.filter((request) => request.status === 'approved').length,
      teamAbsences: this.requestsSubject.value.filter((request) => request.team === 'Platform' && request.status === 'approved').length,
      remainingLeaveDays: balance?.remainingDays ?? 0
    };
  }

  private countDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(0, end.getTime() - start.getTime());
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  }

  private appendApproval(requestId: string, approverId: string, action: ApprovalHistory['action'], note?: string): void {
    this.approvalsSubject.next([
      ...this.approvalsSubject.value,
      {
        requestId,
        approverId,
        action,
        note: note?.trim() || null,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  private appendNotification(userId: string, title: string, message: string): void {
    this.notificationsSubject.next([
      ...this.notificationsSubject.value,
      {
        userId,
        title,
        message,
        createdAt: new Date().toISOString(),
        readAt: null
      }
    ]);
  }

  private appendAudit(action: string, entityType: string, entityId: string, metadata: Record<string, unknown>): void {
    this.auditLogsSubject.next([
      ...this.auditLogsSubject.value,
      {
        actorId: null,
        action,
        entityType,
        entityId,
        metadata,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  private buildNotificationTitle(status: 'approved' | 'rejected' | 'cancelled'): string {
    return `Holiday request ${status}`;
  }

  private buildNotificationMessage(request: HolidayRequest, status: 'approved' | 'rejected' | 'cancelled'): string {
    return `Your request from ${request.startDate} to ${request.endDate} was ${status}.`;
  }
}
