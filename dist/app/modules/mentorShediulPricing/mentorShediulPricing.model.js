"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mentorShediulPricingSchema = new mongoose_1.default.Schema({
    price: {
        type: Number,
        required: true,
        default: 15
    }
});
const MentorShediulPricing = mongoose_1.default.model('MentorShediulPricing', mentorShediulPricingSchema);
exports.default = MentorShediulPricing;
// Create function to insert data into the database
