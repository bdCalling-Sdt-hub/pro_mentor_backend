"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const shediulBooking_controller_1 = require("./shediulBooking.controller");
const bookingRouter = express_1.default.Router();
bookingRouter
    .post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), 
// validateRequest(videoValidation.VideoSchema),
shediulBooking_controller_1.mentorBookingController.createMentorBooking)
    // akoi mentor and mentee koto gula booking shedule nise // mentor dekhbe
    .get('/mentor', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), shediulBooking_controller_1.mentorBookingController.getBookingByMentor)
    .get('/mentor/all-booking', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), shediulBooking_controller_1.mentorBookingController.getBookingByMentorAllBooking)
    // akoi mentor and mentee koto gula booking shedule nise // mentee dekhbe
    .get('/mentee', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), shediulBooking_controller_1.mentorBookingController.getBookingByMentee)
    .get('/mentee/all-booking', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), shediulBooking_controller_1.mentorBookingController.getBookingByMenteeAllBooking)
    .get('/:id', shediulBooking_controller_1.mentorBookingController.getSingleMentorBooking)
    .patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), shediulBooking_controller_1.mentorBookingController.updateSingleMentorBooking)
    .patch('/re-shedule-booking/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), shediulBooking_controller_1.mentorBookingController.reSheduleMentorBooking)
    .delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR, user_constants_1.USER_ROLE.MENTEE), shediulBooking_controller_1.mentorBookingController.deleteSingleMentorBooking);
exports.default = bookingRouter;
