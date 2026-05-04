export interface HolidayRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
}
