import { Types } from "mongoose";

export type TMentorRegistration = {
  mentorId: Types.ObjectId;
  title?: string;
  fullName: string;
  preferredName: string;
  pronouns: string;
  contactNum: number;
  email: string;
  country: string;
  gender: string;
  about: string;
  introVideo?: string;
  industryExpertise: string;
  careerLavel: string;
  specializedSkill: string;
  education: string;
  experience: string;
  preferredDays: [string];
  startTime: string;
  endTime: string;
  status: 'pending' | 'accept' | 'cenceled';
  professionalCredential: [string];
  additionalDocument: [string];
};