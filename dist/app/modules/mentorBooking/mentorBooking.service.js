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
exports.mentorBookingService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mentorBooking_model_1 = __importDefault(require("./mentorBooking.model"));
const notification_service_1 = require("../notification/notification.service");
const mentorRegistration_model_1 = require("../mentorRegistration/mentorRegistration.model");
const createMentorBookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // console.log('payload', payload);
        if (!payload.mentorId || !payload.menteeId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Mentor or Mentee not found!');
        }
        const isBookingExist = yield mentorBooking_model_1.default.findOne({
            mentorId: payload.mentorId,
            menteeId: payload.menteeId,
        })
            .session(session)
            .lean();
        if (isBookingExist) { // Check if a booking already exists for the same mentor and mentee
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Mentor Booking already exists!');
        }
        const result = yield mentorBooking_model_1.default.create([payload], { session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add Mentor Booking!!');
        }
        const notificationData = {
            userId: result[0].mentorId,
            message: `Booking mentor is successful!`,
            type: 'success',
        };
        const notificationData2 = {
            userId: result[0].menteeId,
            message: `Booking mentee is successful!`,
            type: 'success',
        };
        const notificationResult = yield notification_service_1.notificationService.createNotification(notificationData, session);
        const notificationResult2 = yield notification_service_1.notificationService.createNotification(notificationData2, session);
        if (!notificationResult || !notificationResult2) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create notification');
        }
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error in createMentorBookingService:', error);
        session.endSession();
        throw error;
    }
});
const getAllMentorBookingByIdQuery = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('mentorId', mentorId);
    const BookingQuery = new QueryBuilder_1.default(mentorBooking_model_1.default.find({ mentorId }).populate('mentorId').populate('menteeId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield BookingQuery.modelQuery;
    const meta = yield BookingQuery.countTotal();
    return { meta, result };
});
const getAllMenteeBookingByQuery = (query, menteeId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('menteeId', menteeId);
    // Create the base query using QueryBuilder
    const bookingQuery = new QueryBuilder_1.default(mentorBooking_model_1.default.find({ menteeId }).populate('mentorId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    // Execute the query to fetch bookings
    const result = yield bookingQuery.modelQuery;
    // console.log({ result });
    // Now populate 'mentorRegistrationId' for each mentorId
    for (let booking of result) {
        if (booking && booking.mentorId) {
            yield booking.populate('mentorId.mentorRegistrationId');
        }
    }
    const meta = yield bookingQuery.countTotal();
    return { meta, result };
});
const getSingleMentorBookingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mentorBooking = yield mentorBooking_model_1.default.findById(id);
    if (!mentorBooking) {
        throw new AppError_1.default(404, 'Mentor Booking Not Found!!');
    }
    const result = yield mentorBooking_model_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (result.length === 0) {
        throw new AppError_1.default(404, 'Mentor Booking not found!');
    }
    return result[0];
});
const acceptMentorBookingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession(); // Start a session
    session.startTransaction(); // Start the transaction
    try {
        // Find the mentor booking by ID and populate the necessary fields
        const mentorBooking = yield mentorBooking_model_1.default.findById(id)
            .populate({
            path: 'mentorId', // Populate the full mentorId object (not just the ObjectId)
            populate: { path: 'mentorRegistrationId' }, // Populate mentorRegistrationId inside mentorId
        })
            .session(session);
        if (!mentorBooking) {
            throw new AppError_1.default(404, 'Mentor Booking Not Found!!');
        }
        //  const mentorRegistrationIDD = mentorBooking.mentorId?.mentorRegistrationId;
        const mentorRegistrationIDD = (_a = mentorBooking.mentorId) === null || _a === void 0 ? void 0 : _a.mentorRegistrationId;
        // Update the mentor booking status to 'accepted'
        const result = yield mentorBooking_model_1.default.findByIdAndUpdate(id, { status: 'accepted' }, { new: true, session });
        if (!result) {
            throw new AppError_1.default(404, 'Failed to update Mentor Booking status!');
        }
        // Retrieve the mentor registration to increment the membership count
        const mentorRegistration = yield mentorRegistration_model_1.MentorRegistration.findById(mentorRegistrationIDD).session(session); // Ensure mentorRegistration update is part of the session
        if (!mentorRegistration) {
            throw new AppError_1.default(404, 'Mentor Registration Not Found!!');
        }
        // Update the mentor registration (increment membership count)
        const result2 = yield mentorRegistration_model_1.MentorRegistration.findByIdAndUpdate(mentorRegistrationIDD, // Use the correct mentor registration ID here
        { membershipCount: (mentorRegistration.membershipCount || 0) + 1 }, { new: true, session });
        if (!result2) {
            throw new AppError_1.default(404, 'Failed to update Mentor Registration membership count!');
        }
        // Commit the transaction after all updates succeed
        yield session.commitTransaction();
        session.endSession();
        return result; // Return the updated mentor booking status
    }
    catch (error) {
        // If anything fails, abort the transaction
        yield session.abortTransaction();
        console.error('Error in acceptMentorBookingQuery:', error);
        session.endSession(); // End the session after abort
        throw error; // Rethrow the error after handling
    }
});
const cencelMentorBookingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mentorBooking = yield mentorBooking_model_1.default.findById(id);
    // console.log('id ', id);
    // console.log('mentorBooking ', mentorBooking);
    if (!mentorBooking) {
        throw new AppError_1.default(404, 'Mentor Booking  Not Found!!');
    }
    const result = yield mentorBooking_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(404, 'Failed to cencel Mentor Booking!');
    }
    return result;
});
exports.mentorBookingService = {
    createMentorBookingService,
    getAllMentorBookingByIdQuery,
    getAllMenteeBookingByQuery,
    getSingleMentorBookingQuery,
    acceptMentorBookingQuery,
    cencelMentorBookingQuery,
};
