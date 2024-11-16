import { Schema, model, Types } from 'mongoose';
import { TMentorRegistration } from './mentorRegistration.interface';

const MentorRegistrationSchema = new Schema<TMentorRegistration>(
  {
    mentorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: false, default: '' },
    fullName: { type: String, required: true },
    preferredName: { type: String, required: true },
    pronouns: { type: String, required: true },
    contactNum: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    gender: { type: String, required: true },
    about: { type: String, required: true },
    introVideo: { type: String, required: false, default: '' },
    industryExpertise: { type: String, required: true },
    careerLavel: { type: String, required: true },
    specializedSkill: { type: String, required: true },
    education: { type: String, required: true },
    experience: { type: String, required: true },
    preferredDays: { type: [String], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accept', 'cenceled'],
      default: 'pending',
    },
    professionalCredential: { type: [String], required: true },
    additionalDocument: { type: [String], required: true },
  },
  { timestamps: true },
);

export const MentorRegistration = model<TMentorRegistration>(
  'MentorRegistration',
  MentorRegistrationSchema,
);


