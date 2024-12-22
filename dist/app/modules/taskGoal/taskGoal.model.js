"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    taskName: { type: String, required: true },
    taskfiles: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending', required: true },
});
const TaskGoalSchema = new mongoose_1.Schema({
    goalName: { type: String, required: true },
    status: {
        type: String,
        enum: ['running', 'checking', 'completed'],
        default: 'running',
        required: true,
    },
    tasks: { type: [TaskSchema], required: false, default: [] },
    menteeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    goalProgress: { type: Number, required: true, default: 0 },
    taskCount: { type: Number, required: true, default: 3 },
});
const TaskGoal = (0, mongoose_1.model)('TaskGoal', TaskGoalSchema);
exports.default = TaskGoal;
