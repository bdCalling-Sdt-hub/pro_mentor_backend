"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMentorShediulPricing = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mentorShediulPricingSchema = new mongoose_1.default.Schema({
    price: {
        type: Number,
        required: true,
        default: 0
    }
});
const MentorShediulPricing = mongoose_1.default.model('MentorShediulPricing', mentorShediulPricingSchema);
exports.default = MentorShediulPricing;
// Create function to insert data into the database
const createMentorShediulPricing = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentorShediulPricing = new MentorShediulPricing(data);
        const savedData = yield mentorShediulPricing.save();
        console.log('Data saved:', savedData);
    }
    catch (error) {
        console.error('Error saving data:', error);
    }
});
exports.createMentorShediulPricing = createMentorShediulPricing;
