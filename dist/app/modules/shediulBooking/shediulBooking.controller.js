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
exports.mentorBookingController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const shediulBooking_service_1 = require("./shediulBooking.service");
const moment_1 = __importDefault(require("moment"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const shediulBooking_model_1 = __importDefault(require("./shediulBooking.model"));
const createMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    // console.log('bodyData', bodyData);
    const { userId } = req.user;
    bodyData.menteeId = userId;
    // console.log('bodyData.bookingTime', bodyData.bookingTime);
    const startTime = (0, moment_1.default)(bodyData.bookingTime, 'hh:mm A');
    const endTime = startTime.clone().add(bodyData.duration - 1, 'minutes');
    bodyData.startTime = startTime.format('hh:mm A');
    bodyData.endTime = endTime.format('hh:mm A');
    // console.log({ startTime, endTime });
    const result = yield shediulBooking_service_1.mentorBookingService.createMentorBookingService(bodyData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking successfully!',
        data: result,
    });
}));
const reSheduleMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    const id = req.params.id;
    const { userId } = req.user;
    bodyData.menteeId = userId;
    const startTime = (0, moment_1.default)(bodyData.bookingTime, 'hh:mm A');
    const existingBooking = yield shediulBooking_model_1.default.findOne({ _id: id });
    if (!existingBooking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    bodyData.duration = existingBooking.duration;
    const endTime = startTime.clone().add(bodyData.duration - 1, 'minutes');
    bodyData.startTime = startTime.format('hh:mm A');
    bodyData.endTime = endTime.format('hh:mm A');
    const result = yield shediulBooking_service_1.mentorBookingService.reSheduleMentorBookingService(id, bodyData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking successfully!',
        data: result,
    });
}));
const getBookingByMentor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { menteeId } = req.query;
    const { meta, result } = yield shediulBooking_service_1.mentorBookingService.getAllMentorBookingByQuery(req.query, userId, menteeId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Booking By Mentor are requered successful!!',
    });
}));
const getBookingByMentorAllBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield shediulBooking_service_1.mentorBookingService.getAllMentorByMenteeBookingByQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Booking By Mentor are requered successful!!',
    });
}));
const getBookingByMenteeAllBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield shediulBooking_service_1.mentorBookingService.getAllMenteeByMentorBookingByQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Booking By Mentor are requered successful!!',
    });
}));
const getBookingByMentee = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { mentorId } = req.query;
    const { meta, result } = yield shediulBooking_service_1.mentorBookingService.getAllMenteeBookingByQuery(req.query, userId, mentorId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Booking By Mentee are requered successful!!',
    });
}));
const getSingleMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shediulBooking_service_1.mentorBookingService.getSingleMentorBookingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Booking are requered successful!!',
    });
}));
const updateSingleMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get video ID from the route
    const updateData = req.body;
    // Call the service to update the video
    const result = yield shediulBooking_service_1.mentorBookingService.updateMentorBookingQuery(id, updateData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Video updated successfully!',
        data: result,
    });
}));
const deleteSingleMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shediulBooking_service_1.mentorBookingService.deletedMentorBookingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Booking are successful!!',
    });
}));
exports.mentorBookingController = {
    createMentorBooking,
    getBookingByMentor,
    reSheduleMentorBooking,
    getBookingByMentorAllBooking,
    getBookingByMenteeAllBooking,
    getBookingByMentee,
    getSingleMentorBooking,
    updateSingleMentorBooking,
    deleteSingleMentorBooking,
};
