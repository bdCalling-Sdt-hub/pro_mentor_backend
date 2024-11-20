import mongoose, { Schema, Document } from 'mongoose';
import { TMentorBooking } from './mentorBooking.interface';

const MentorBookingSchema: Schema = new Schema<TMentorBooking>(
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
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

// Create the model
const MentorBooking = mongoose.model<TMentorBooking>(
  'MentorBooking',
  MentorBookingSchema,
);

export default MentorBooking;
