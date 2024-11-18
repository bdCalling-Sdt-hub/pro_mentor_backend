import { model, Schema } from 'mongoose';
import { TAvailableTime } from './availableTime.interface';

const availableTimeSchema = new Schema<TAvailableTime>({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  days: {
    type: [String],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

export const AvailableTime = model<TAvailableTime>(
  'AvailableTime',
  availableTimeSchema,
);