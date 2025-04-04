"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorRegistration = void 0;
const mongoose_1 = require("mongoose");
const MentorRegistrationSchema = new mongoose_1.Schema({
    mentorId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: false, default: '' },
    fullName: { type: String, required: true },
    preferredName: { type: String, required: true },
    pronouns: { type: String, required: true },
    contactNum: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    location: { type: String, required: true },
    gender: { type: String, required: true },
    about: { type: String, required: true },
    reviewCount: { type: Number, required: false, default: 0 },
    ratingCount: { type: Number, required: false, default: 0 },
    membershipCount: { type: Number, required: false, default: 0 },
    introVideo: { type: String, required: false, default: '' },
    industryExpertise: { type: String, required: true },
    careerLavel: { type: String, required: false },
    specializedSkill: { type: String, required: true },
    education: { type: String, required: true },
    mentorExperience: { type: String, required: true },
    mentoringStyle: { type: String, required: true },
    preferredDays: { type: [String], required: true },
    availableTime: { type: String, required: false },
    startBreakTime: { type: String, required: false, default: '' },
    endBreakTime: { type: String, required: false, default: '' },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'accept', 'cenceled'],
        default: 'pending',
    },
    professionalCredential: { type: [String], required: false },
    additionalDocument: { type: [String], required: false },
}, { timestamps: true });
MentorRegistrationSchema.index({
    fullName: 'text',
    industryExpertise: 'text',
    specializedSkill: 'text',
});
exports.MentorRegistration = (0, mongoose_1.model)('MentorRegistration', MentorRegistrationSchema);
