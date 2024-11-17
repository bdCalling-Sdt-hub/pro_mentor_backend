import { model, Schema } from "mongoose";
import { TTaskGoal } from "./taskGoal.interface";

const taskGoalSchema = new Schema<TTaskGoal>(
  {
    goalName: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    taskfiles: [String],
    bookingScheduleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'BookingSchedule',
    },
    menteeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const TaskGoal = model<TTaskGoal>('TaskGoal', taskGoalSchema);
