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
const mentorBooking_service_1 = require("./mentorBooking.service");
const createMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    const { userId } = req.user;
    bodyData.menteeId = userId;
    const result = yield mentorBooking_service_1.mentorBookingService.createMentorBookingService(bodyData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Mentor Booking added successfully!',
        data: result,
    });
}));
const getMentorBookingByMentor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield mentorBooking_service_1.mentorBookingService.getAllMentorBookingByIdQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Mentor Booking are requered successful!!',
    });
}));
const getMenteeBookingByMentor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield mentorBooking_service_1.mentorBookingService.getAllMenteeBookingByQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Mentor Booking are requered successful!!',
    });
}));
const getSingleMentorBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentorBooking_service_1.mentorBookingService.getSingleMentorBookingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Mentor Booking are requered successful!!',
    });
}));
const acceptSingleMentorVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentorBooking_service_1.mentorBookingService.acceptMentorBookingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Accept Mentor Booking are successful!!',
    });
}));
const cencelSingleMentorVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentorBooking_service_1.mentorBookingService.cencelMentorBookingQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Cencel Mentor Booking are successful!!',
    });
}));
exports.mentorBookingController = {
    createMentorBooking,
    getMentorBookingByMentor,
    getMenteeBookingByMentor,
    getSingleMentorBooking,
    acceptSingleMentorVideo,
    cencelSingleMentorVideo,
};
