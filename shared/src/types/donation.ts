export enum DonationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Donation {
  id: string;
  amount: number; // TS handles this as number, but we stringify/parse for decimals over the wire
  currency: string;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  message?: string;
  status: DonationStatus;
  PaymentOrderId?: string;
  paymentId?: string;
  programId?: string;
  userId?: string;
  completedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
