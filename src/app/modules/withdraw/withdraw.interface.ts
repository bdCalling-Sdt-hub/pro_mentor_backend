import { Types } from "mongoose";

export type TWithdraw = {
  mentorId: Types.ObjectId;
  amount: number;
  method: string;
  status: string;
  bankDetails?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    exp: string;
    cvc: string;
  };
  paypalPayDetails?: {
    paypalId: string;
  };
  transactionDate: Date;
};