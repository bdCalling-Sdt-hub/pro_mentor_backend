"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const mentorBooking_controller_1 = require("./mentorBooking.controller");
const mentorBookingRouter = express_1.default.Router();
mentorBookingRouter
    .post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), 
// validateRequest(videoValidation.VideoSchema),
mentorBooking_controller_1.mentorBookingController.createMentorBooking)
    .get('/mentor/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), mentorBooking_controller_1.mentorBookingController.getMentorBookingByMentor)
    .get('/mentee/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), mentorBooking_controller_1.mentorBookingController.getMenteeBookingByMentor)
    .get('/:id', mentorBooking_controller_1.mentorBookingController.getSingleMentorBooking)
    .patch('/accept/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), mentorBooking_controller_1.mentorBookingController.acceptSingleMentorVideo)
    .patch('/cencel/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR, user_constants_1.USER_ROLE.MENTEE), mentorBooking_controller_1.mentorBookingController.cencelSingleMentorVideo);
exports.default = mentorBookingRouter;
