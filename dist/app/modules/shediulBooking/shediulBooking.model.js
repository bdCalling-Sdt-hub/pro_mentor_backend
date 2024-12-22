"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ScheduleBookingSchema = new mongoose_1.Schema({
    menteeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
const ScheduleBooking = mongoose_1.default.model('ScheduleBooking', ScheduleBookingSchema);
exports.default = ScheduleBooking;
