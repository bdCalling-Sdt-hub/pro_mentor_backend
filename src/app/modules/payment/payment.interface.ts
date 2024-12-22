import { Types } from 'mongoose';

export type TPayment = {
  mentorId: Types.ObjectId;
  menteeId: Types.ObjectId;
  sheduleBookingId?: Types.ObjectId;
  amount: number;
  adminAmount?: number;
  method: string;
  status: string;
  bankDetails?: {
    accountPiNumber: string;
  };
  paypalPayDetails?: {
    paypalId: string;
  };
  applePayDetails?: {
    appleId: string;
  };
  transactionId: string;
  transactionDate: Date;
  createdAt: Date;
};
