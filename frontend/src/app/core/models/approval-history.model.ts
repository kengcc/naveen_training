export interface ApprovalHistory {
  requestId: string;
  approverId: string;
  action: 'approved' | 'rejected' | 'cancelled';
  note?: string | null;
  createdAt: string;
}
