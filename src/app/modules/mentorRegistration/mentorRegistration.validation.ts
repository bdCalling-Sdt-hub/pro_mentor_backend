import { z } from 'zod';

const mentorRegistrationValidationSchema = z.object({
  body: z.object({
    mentorId: z.string().optional(),
    title: z.string().optional().default(''),
    fullName: z.string().min(1, 'Full name is required'),
    preferredName: z.string().min(1, 'Preferred name is required'),
    pronouns: z.string().min(1, 'Pronouns are required'),
    contactNum: z
      .number()
      .int()
      .positive('Contact number must be a positive integer'),
    email: z.string().email('Invalid email format'),
    country: z.string().min(1, 'Country is required'),
    gender: z.string().min(1, 'Gender is required'),
    about: z.string().min(1, 'About is required'),
    introVideo: z.string().optional().default(''),
    industryExpertise: z.string().min(1, 'Industry expertise is required'),
    careerLavel: z.string().min(1, 'Career level is required'),
    specializedSkill: z.string().min(1, 'Specialized skill is required'),
    education: z.string().min(1, 'Education is required'),
    experience: z.string().min(1, 'Experience is required'),
    preferredDays: z.string().min(1, 'Preferred days are required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    professionalCredential: z
      .array(z.string().min(1, 'Each credential must have content'))
      .min(1, 'Professional credential is required'),
    additionalDocument: z
      .array(z.string().min(1, 'Each document must have content'))
      .min(1, 'Additional document is required'),
  }),
});

export const mentorRegistrationValidation = {
  mentorRegistrationValidationSchema,
};
