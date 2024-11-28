import { Types } from "mongoose";

export type TTask = {
  _id:string;
  taskName: string;
  taskfiles?: string[];
  status: string;
}
export type TTaskGoal = {
  goalName: string;
  status: string;
  tasks?: TTask[];
  bookingScheduleId: Types.ObjectId;
  menteeId: Types.ObjectId;
  mentorId: Types.ObjectId;
  goalProgress: number;
};