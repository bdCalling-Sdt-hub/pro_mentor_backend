"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shediulPricingRoutes = void 0;
const express_1 = require("express");
const mentorShediulPricing_controller_1 = require("./mentorShediulPricing.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
exports.shediulPricingRoutes = (0, express_1.Router)();
exports.shediulPricingRoutes
    .get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN), mentorShediulPricing_controller_1.mentorShediulPricingController.getAllMentorShedulePricing)
    .patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN), mentorShediulPricing_controller_1.mentorShediulPricingController.updateMentorShedulePricing);
