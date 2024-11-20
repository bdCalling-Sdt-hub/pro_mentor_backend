import { Types } from "mongoose";

export type TMentorBooking = {
  mentorId: Types.ObjectId;
  menteeId: Types.ObjectId;
  status: string;
};