import { Types } from "mongoose";

export type TAvailableTime = {
  time: string;
  duration: number;
};

// Define the TAvailableTimeSlots type for the complete available time document
export type TAvailableTimeSlots = {
  mentorId: Types.ObjectId; // Reference to the mentor
  date: Date; // The date for available slots
  availableSlots: TAvailableTime[]; // Array of available time slots
};
