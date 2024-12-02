import { model, Schema } from 'mongoose';
import { TAvailableTime, TAvailableTimeSlots } from './availableTime.interface';


const AvailableTimeSlotSchema = new Schema<TAvailableTime>({
  time: {
    type: String, 
    required: true,
  },
  duration: {
    type: Number, 
    required: true,
  },
});

// Define the AvailableTime schema for the complete available time document
const availableTimeSchema = new Schema<TAvailableTimeSlots>(
  {
    mentorId: {
      type: Schema.Types.ObjectId, 
      required: true,
      ref: 'User', 
    },
    date: {
      type: Date, 
      required: true,
    },
    availableSlots: {
      type: [AvailableTimeSlotSchema], 
      required: true,
    },
  },
  { timestamps: true }, 
);

// Create the model from the schema
export const AvailableTime = model<TAvailableTimeSlots>(
  'AvailableTime', 
  availableTimeSchema, 
);
