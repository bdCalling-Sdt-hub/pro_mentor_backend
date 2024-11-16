import { Types } from "mongoose";

export type TTaskGoal = {
    goalName: string;
    taskName : string;
    files: string[];
    bookingScheduleId: Types.ObjectId;
    menteeId: Types.ObjectId;

};