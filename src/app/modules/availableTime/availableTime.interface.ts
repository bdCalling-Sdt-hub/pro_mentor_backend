import { Types } from "mongoose";

export type TAvailableTime = {
    mentorId: Types.ObjectId;
    days: [string];
    startTime: string;
    endTime: string;
};