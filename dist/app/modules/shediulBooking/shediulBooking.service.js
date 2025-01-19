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
const shediulBooking_model_1 = __importDefault(require("./shediulBooking.model"));
const moment_1 = __importDefault(require("moment"));
const shediulBooking_utils_1 = require("./shediulBooking.utils");
const createMentorBookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingDate, startTime, endTime, mentorId } = payload;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isValidTimeFormat = (time) => (0, moment_1.default)(time, 'hh:mm A', true).isValid();
        if (typeof startTime !== 'string' ||
            typeof endTime !== 'string' ||
            !isValidTimeFormat(startTime) ||
            !isValidTimeFormat(endTime)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid time format for start or end time');
        }
        const existingBooking = yield shediulBooking_model_1.default.findOne({
            mentorId,
            bookingDate,
            $or: [
                {
                    $and: [
                        { startTime: { $gte: startTime } },
                        { startTime: { $lte: endTime } },
                    ],
                },
                {
                    $and: [
                        { endTime: { $gte: startTime } },
                        { endTime: { $lte: endTime } },
                    ],
                },
            ],
        });
        if (existingBooking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Booking time is overlapping with an existing booking');
        }
        // Create the booking
        const result = yield shediulBooking_model_1.default.create([payload], { session });
        if (!result[0]) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add booking');
        }
        // Generate Zoom meeting link after the booking is created
        const meetingData = {
            topic: 'Mentoring Service Meeting',
            agenda: 'Discuss Services',
            start_time: result[0].startTime,
            duration: result[0].duration,
        };
        // console.log('......error....1.....');
        // Example usage
        const meetingLink = yield (0, shediulBooking_utils_1.generateZoomMeetingLink)(meetingData);
        // console.log('......error......2...');
        // console.log('meetingLink', meetingLink);
        // console.log('......error.......3..');
        if (!meetingLink) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add booking');
        }
        // console.log('......error....4.....');
        // {
        //   meetingLink: 'https://us05web.zoom.us/j/86238675435?pwd=oo95DlDSI8l2Dwzua4bQiH8PAKA3in.1',
        //   startTime: '2024-12-07T11:52:24Z',
        //   endTime: '2024-12-07T06:15:24.067Z',
        //   agenda: 'Discuss Services'
        // }
        if (meetingLink) {
            // Update the booking with the Zoom meeting ID in the same transaction
            yield shediulBooking_model_1.default.findOneAndUpdate({ _id: result[0]._id }, { zoomMeetingId: {
                    meetingLink: meetingLink.meetingLink,
                    startTime: meetingLink.startTime,
                    endTime: meetingLink.endTime,
                    agenda: meetingLink.agenda
                } }, { new: true, session });
        }
        // console.log('......error....5.....');
        // console.log('result booking', result[0]);
        // // console.log(meetingDetails);
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const reSheduleMentorBookingService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingDate, startTime, endTime, mentorId } = payload;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isValidTimeFormat = (time) => (0, moment_1.default)(time, 'hh:mm A', true).isValid();
        if (typeof startTime !== 'string' ||
            typeof endTime !== 'string' ||
            !isValidTimeFormat(startTime) ||
            !isValidTimeFormat(endTime)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid time format for start or end time');
        }
        const existingBooking = yield shediulBooking_model_1.default.findOne({
            mentorId,
            bookingDate,
            $or: [
                {
                    $and: [
                        { startTime: { $gte: startTime } },
                        { startTime: { $lte: endTime } },
                    ],
                },
                {
                    $and: [
                        { endTime: { $gte: startTime } },
                        { endTime: { $lte: endTime } },
                    ],
                },
            ],
        });
        if (existingBooking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Booking time is overlapping with an existing booking');
        }
        const updateReSheduleData = {
            bookingDate: payload.bookingDate,
            bookingTime: payload.bookingTime,
            startTime: payload.startTime,
            endTime: payload.endTime,
        };
        // console.log('updateReSheduleData', updateReSheduleData);
        const result = yield shediulBooking_model_1.default.findOneAndUpdate({ _id: id }, updateReSheduleData, {
            new: true, session
        });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add booking');
        }
        // Generate Zoom meeting link after the booking is created
        const meetingData = {
            topic: 'Mentoring Service Meeting',
            agenda: 'Discuss Services',
            start_time: result.startTime,
            duration: result.duration,
        };
        // Example usage
        const meetingLink = yield (0, shediulBooking_utils_1.generateZoomMeetingLink)(meetingData);
        if (!meetingLink) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add booking');
        }
        if (meetingLink) {
            // Update the booking with the Zoom meeting ID in the same transaction
            yield shediulBooking_model_1.default.findOneAndUpdate({ _id: result._id }, {
                zoomMeetingId: {
                    meetingLink: meetingLink.meetingLink,
                    startTime: meetingLink.startTime,
                    endTime: meetingLink.endTime,
                    agenda: meetingLink.agenda,
                },
            }, { new: true, session });
        }
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getSingleMentorBookingAvailableTimeSlotsQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield shediulBooking_model_1.default.findById(id);
    if (!booking) {
        throw new AppError_1.default(404, 'Booking Not Found!!');
    }
    const mentorBooking = yield shediulBooking_model_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (mentorBooking.length === 0) {
        throw new AppError_1.default(404, 'Booking not found!');
    }
    return mentorBooking[0];
});
const getAllMentorBookingByQuery = (query, mentorId, menteeId) => __awaiter(void 0, void 0, void 0, function* () {
    const BookingQuery = new QueryBuilder_1.default(shediulBooking_model_1.default.find({ mentorId, menteeId }).populate('menteeId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield BookingQuery.modelQuery;
    const meta = yield BookingQuery.countTotal();
    return { meta, result };
});
// akhane all mentor ke get kora hoase jara ai mentee ke booking korese
const getAllMentorByMenteeBookingByQuery = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('query', query);
    const BookingQuery = new QueryBuilder_1.default(shediulBooking_model_1.default.find({ mentorId }).populate('mentorId').populate('menteeId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield BookingQuery.modelQuery;
    const meta = yield BookingQuery.countTotal();
    return { meta, result };
});
// akhane all mentee ke get kora hoase jara ai mentor ke booking korese
const getAllMenteeByMentorBookingByQuery = (query, menteeId) => __awaiter(void 0, void 0, void 0, function* () {
    const BookingQuery = new QueryBuilder_1.default(shediulBooking_model_1.default.find({ menteeId }).populate('mentorId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield BookingQuery.modelQuery;
    const meta = yield BookingQuery.countTotal();
    return { meta, result };
});
const getAllMenteeBookingByQuery = (query, menteeId, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingQuery = new QueryBuilder_1.default(shediulBooking_model_1.default.find({ menteeId, mentorId }).populate('mentorId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield bookingQuery.modelQuery;
    const meta = yield bookingQuery.countTotal();
    return { meta, result };
});
const getSingleMentorBookingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield shediulBooking_model_1.default.findById(id);
    if (!booking) {
        throw new AppError_1.default(404, 'Booking Not Found!!');
    }
    const mentorBooking = yield shediulBooking_model_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (mentorBooking.length === 0) {
        throw new AppError_1.default(404, 'Booking not found!');
    }
    return mentorBooking[0];
});
const updateMentorBookingQuery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingMentor = yield shediulBooking_model_1.default.findById(id);
    if (!bookingMentor) {
        throw new AppError_1.default(404, 'Booking Not Found!!');
    }
    const result = yield shediulBooking_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deletedMentorBookingQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield shediulBooking_model_1.default.findById(id);
    if (!booking) {
        throw new AppError_1.default(404, 'Booking  Not Found!!');
    }
    const result = yield shediulBooking_model_1.default.findOneAndDelete({ _id: id });
    return result;
});
exports.mentorBookingService = {
    createMentorBookingService,
    getAllMentorBookingByQuery,
    reSheduleMentorBookingService,
    getAllMentorByMenteeBookingByQuery,
    getAllMenteeByMentorBookingByQuery,
    getAllMenteeBookingByQuery,
    getSingleMentorBookingQuery,
    updateMentorBookingQuery,
    deletedMentorBookingQuery,
    //   getSettings,
};
