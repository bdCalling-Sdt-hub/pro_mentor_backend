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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorAutoShediulPricing = void 0;
const mentorShediulPricing_model_1 = require("../modules/mentorShediulPricing/mentorShediulPricing.model");
// Async function to call the create method
const mentorAutoShediulPricing = () => __awaiter(void 0, void 0, void 0, function* () {
    const mentorShediulPricing = {
        price: 0,
    };
    yield (0, mentorShediulPricing_model_1.createMentorShediulPricing)(mentorShediulPricing);
});
exports.mentorAutoShediulPricing = mentorAutoShediulPricing;
