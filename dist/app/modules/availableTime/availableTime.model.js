"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTime = void 0;
const mongoose_1 = require("mongoose");
const AvailableTimeSlotSchema = new mongoose_1.Schema({
    time: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
});
// Define the AvailableTime schema for the complete available time document
const availableTimeSchema = new mongoose_1.Schema({
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
    },
    availableSlots: {
        type: [AvailableTimeSlotSchema],
        required: true,
    },
}, { timestamps: true });
// Create the model from the schema
exports.AvailableTime = (0, mongoose_1.model)('AvailableTime', availableTimeSchema);
