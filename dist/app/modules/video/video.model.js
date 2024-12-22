"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const VideoSchema = new mongoose_1.Schema({
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: false,
    },
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Video = (0, mongoose_1.model)('Video', VideoSchema);
