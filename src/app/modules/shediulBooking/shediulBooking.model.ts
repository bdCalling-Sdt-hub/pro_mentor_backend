import mongoose, { Schema } from 'mongoose';
import { TShedualBooking } from './shediulBooking.interface';


const ScheduleBookingSchema = new Schema<TShedualBooking>(
  {
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
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
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
    status: {
      type: String,
      required: true,
      enum: ['Booked', 'completed'],
      default: 'Booked',
    },
  },
  { timestamps: true },
); 


const ScheduleBooking = mongoose.model<TShedualBooking>(
  'ScheduleBooking',
  ScheduleBookingSchema,
);

export default ScheduleBooking;
