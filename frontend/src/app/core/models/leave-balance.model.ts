export interface LeaveBalance {
  userId: string;
  year: number;
  entitlementDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
}
