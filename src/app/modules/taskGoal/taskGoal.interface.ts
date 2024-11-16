import { Types } from "mongoose";

export type TTaskGoal = {
  goalName: string;
  taskName: string;
  taskfiles?: string[];
  bookingScheduleId: Types.ObjectId;
  menteeId: Types.ObjectId;
  mentorId: Types.ObjectId;
};