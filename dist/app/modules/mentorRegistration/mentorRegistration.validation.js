"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorRegistrationValidation = void 0;
const zod_1 = require("zod");
const mentorRegistrationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        mentorId: zod_1.z.string().optional(),
        title: zod_1.z.string().optional().default(''),
        fullName: zod_1.z.string().min(1, 'Full name is required'),
        preferredName: zod_1.z.string().min(1, 'Preferred name is required'),
        pronouns: zod_1.z.string().min(1, 'Pronouns are required'),
        contactNum: zod_1.z
            .number()
            .int()
            .positive('Contact number must be a positive integer'),
        email: zod_1.z.string().email('Invalid email format'),
        country: zod_1.z.string().min(1, 'Country is required'),
        gender: zod_1.z.string().min(1, 'Gender is required'),
        about: zod_1.z.string().min(1, 'About is required'),
        introVideo: zod_1.z.string().optional().default(''),
        industryExpertise: zod_1.z.string().min(1, 'Industry expertise is required'),
        careerLavel: zod_1.z.string().min(1, 'Career level is required'),
        specializedSkill: zod_1.z.string().min(1, 'Specialized skill is required'),
        education: zod_1.z.string().min(1, 'Education is required'),
        experience: zod_1.z.string().min(1, 'Experience is required'),
        preferredDays: zod_1.z.string().min(1, 'Preferred days are required'),
        startTime: zod_1.z.string().min(1, 'Start time is required'),
        endTime: zod_1.z.string().min(1, 'End time is required'),
        professionalCredential: zod_1.z
            .array(zod_1.z.string().min(1, 'Each credential must have content'))
            .min(1, 'Professional credential is required'),
        additionalDocument: zod_1.z
            .array(zod_1.z.string().min(1, 'Each document must have content'))
            .min(1, 'Additional document is required'),
    }),
});
exports.mentorRegistrationValidation = {
    mentorRegistrationValidationSchema,
};
