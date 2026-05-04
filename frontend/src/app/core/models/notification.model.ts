export interface Notification {
  userId: string;
  title: string;
  message: string;
  readAt?: string | null;
  createdAt: string;
}
