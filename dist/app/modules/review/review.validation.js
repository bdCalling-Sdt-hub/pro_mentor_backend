"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = exports.reviewSchema = void 0;
const zod_1 = require("zod");
// Zod schema for video validation
exports.reviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().nonempty('Title is required'),
        description: zod_1.z.string().optional(),
        category: zod_1.z.string().nonempty('Category is required'),
        videoUrl: zod_1.z.string().url('Invalid video URL format'),
        thumbnailUrl: zod_1.z.string().url('Invalid thumbnail URL format').optional(),
        views: zod_1.z.number().min(0).default(0),
    }),
});
exports.reviewValidation = {
    reviewSchema: exports.reviewSchema,
};
