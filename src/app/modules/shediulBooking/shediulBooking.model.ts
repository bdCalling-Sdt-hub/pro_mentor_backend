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
    subject: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    industryField: {
      type: String,
      required: true,
    },
    yearOfExperience: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingTime: {
      type: String, // Ensure this is a String type
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
    zoomMeetingId: {
      meetingLink: {
        type: String,
        required: false,
      },
      startTime: {
        type: Date,
        required: false,
      },
      endTime: {
        type: Date,
        required: false,
      },
      agenda: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true },
); 


const ScheduleBooking = mongoose.model<TShedualBooking>(
  'ScheduleBooking',
  ScheduleBookingSchema,
);

export default ScheduleBooking;
