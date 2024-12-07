import { Types } from "mongoose";

interface IZoomMeeting {
  meetingLink?: string;
  startTime?: Date;
  endTime?: Date;
  agenda?: string;
}
export type TShedualBooking = {
  menteeId: Types.ObjectId;
  mentorId: Types.ObjectId;
  subject: string;
  jobTitle: string;
  industryField: string;
  yearOfExperience: string;
  educationLevel: string;
  description: string;
  bookingDate: Date;
  bookingTime?: string;
  duration: number;
  startTime?: string;
  endTime?: string;
  status: string;
  zoomMeetingId?: IZoomMeeting;
};