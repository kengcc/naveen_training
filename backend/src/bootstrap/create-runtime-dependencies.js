import { createHolidayPlannerService } from '../application/holiday-planner.service.js';
import { InMemoryAuditLogRepository } from '../infrastructure/memory/in-memory-audit-log-repository.js';
import { InMemoryHolidayRequestRepository } from '../infrastructure/memory/in-memory-holiday-request-repository.js';
import { InMemoryLeaveBalanceRepository } from '../infrastructure/memory/in-memory-leave-balance-repository.js';
import { InMemoryNotificationRepository } from '../infrastructure/memory/in-memory-notification-repository.js';

export function createRuntimeDependencies({ clock = () => new Date(), seed = {} } = {}) {
  const holidayRequestRepository = new InMemoryHolidayRequestRepository(seed.holidayRequests);
  const leaveBalanceRepository = new InMemoryLeaveBalanceRepository(seed.leaveBalances);
  const auditLogRepository = new InMemoryAuditLogRepository(seed.auditLogs);
  const notificationRepository = new InMemoryNotificationRepository(seed.notifications);

  const holidayPlannerService = createHolidayPlannerService({
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository,
    clock
  });

  return {
    holidayPlannerService,
    holidayRequestRepository,
    leaveBalanceRepository,
    auditLogRepository,
    notificationRepository
  };
}
