export interface HolidayRequest {
  id: string;
  userId: string;
  userName?: string;
  team?: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverId?: string | null;
  decisionNote?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHolidayRequestCommand {
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateHolidayRequestStatusCommand {
  requestId: string;
  actorId: string;
  note?: string;
}
