import { Types } from "mongoose";

export type TShedualBooking = {
  menteeId: Types.ObjectId;
  mentorId: Types.ObjectId;
  bookingDate: Date;
  bookingTime: string;
  duration: number;
  startTime?: string;
  endTime?: string;
  status: string;
};