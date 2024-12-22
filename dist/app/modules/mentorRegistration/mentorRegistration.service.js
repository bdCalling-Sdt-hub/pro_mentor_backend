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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorRegistrationService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_models_1 = require("../user/user.models");
const mentorRegistration_model_1 = require("./mentorRegistration.model");
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const wallet_service_1 = require("../wallet/wallet.service");
const mentorRegistration_utils_1 = require("./mentorRegistration.utils");
const shediulBooking_model_1 = __importDefault(require("../shediulBooking/shediulBooking.model"));
const notification_service_1 = require("../notification/notification.service");
const createMentorRegistrationService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    // console.log('payload payload payload', payload);
    console.log('............service 1............');
    try {
        const user = yield user_models_1.User.findById(payload.mentorId).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found!!');
        }
        console.log({ payload });
        const result = yield mentorRegistration_model_1.MentorRegistration.create([payload], { session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create mentor registration');
        }
        const notificationData = {
            userId: result[0].mentorId._id,
            role: 'admin',
            message: `Mentor Registration is successful!`,
            type: 'success',
        };
        const notificationResult = yield notification_service_1.notificationService.createNotification(notificationData, session);
        if (!notificationResult) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create notification');
        }
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Error in createMentorRegistrationService:', error);
        session.endSession();
        throw error;
    }
});
const getAllMentorRegistrationQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('query -----11111', query);
    const { availableTime, searchTerm, sort, page, limit } = query, filters = __rest(query, ["availableTime", "searchTerm", "sort", "page", "limit"]);
    let queryStart = '';
    let queryEnd = '';
    if (availableTime) {
        const [queryTimeStart, queryTimeEnd] = availableTime.split(' - ');
        queryStart = queryTimeStart;
        queryEnd = queryTimeEnd;
    }
    let queryConditions = {};
    console.log('queryConditions 1', queryConditions);
    if (searchTerm) {
        queryConditions.$text = { $search: String(searchTerm) };
    }
    console.log('queryConditions 2', queryConditions);
    if (filters) {
        for (const [key, value] of Object.entries(filters)) {
            queryConditions[key] = value;
        }
    }
    console.log('queryConditions 3', queryConditions);
    let mentorRegistrations = yield mentorRegistration_model_1.MentorRegistration.find(queryConditions)
        .populate('mentorId')
        .sort('-reviewCount')
        .exec();
    if (queryStart && queryEnd) {
        mentorRegistrations = mentorRegistrations.filter((mentor) => {
            if (!mentor.availableTime)
                return false;
            const [mentorStart, mentorEnd] = mentor.availableTime.split(' - ');
            if (!mentorStart || !mentorEnd)
                return false;
            return (0, mentorRegistration_utils_1.isTimeOverlap)(mentorStart, mentorEnd, queryStart, queryEnd);
        });
    }
    if (sort) {
        console.log('sort', sort);
        const sortFields = sort
            .split(',')
            .reduce((acc, field) => {
            const direction = field.startsWith('-') ? -1 : 1;
            const fieldName = field.startsWith('-') ? field.substring(1) : field;
            acc[fieldName] = direction;
            return acc;
        }, {});
        console.log('sortFields', sortFields);
        mentorRegistrations = yield mentorRegistration_model_1.MentorRegistration.find(queryConditions)
            .populate('mentorId')
            .sort(sortFields)
            .exec();
    }
    const pageNumber = parseInt(String(page), 10) || 1;
    const limitNumber = parseInt(String(limit), 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const paginatedResults = mentorRegistrations.slice(skip, skip + limitNumber);
    return {
        meta: {
            total: mentorRegistrations.length,
            page: pageNumber,
            limit: limitNumber,
        },
        result: paginatedResults,
    };
});
const getMentorAvailableSlots = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId, duration, date } = query;
    console.log('mentorId', mentorId, 'duration', duration, 'date', date);
    const registerMentor = yield mentorRegistration_model_1.MentorRegistration.findOne({ mentorId });
    if (!registerMentor) {
        throw new AppError_1.default(404, 'Register Mentor Not Found!!');
    }
    const bookings = yield shediulBooking_model_1.default.find({
        mentorId,
        bookingDate: new Date(date),
    }).select('startTime  endTime');
    console.log('startTime  ', registerMentor.startTime);
    console.log('endTime  ', registerMentor.endTime);
    console.log('startBreakTime  ', registerMentor.startBreakTime);
    console.log('endBreakTime  ', registerMentor.endBreakTime);
    console.log({ duration });
    console.log({ bookings });
    console.log('minimumSlotTime  ', 15);
    const durationNum = Number(duration);
    const availableSlots = (0, mentorRegistration_utils_1.generateAvailableSlots)({ startTime: registerMentor.startTime,
        endTime: registerMentor.endTime,
        startBreakTime: registerMentor.startBreakTime,
        endBreakTime: registerMentor.endBreakTime,
        bookings,
        duration: durationNum,
        minimumSlotTime: 15, });
    console.log({ availableSlots });
    return { result: availableSlots };
});
const getSingleMentorRegistrationQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const registerMentor = yield mentorRegistration_model_1.MentorRegistration.findById(id);
    if (!registerMentor) {
        throw new AppError_1.default(404, 'Register Mentor Not Found!!');
    }
    const mentorRegistration = yield mentorRegistration_model_1.MentorRegistration.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (mentorRegistration.length === 0) {
        throw new AppError_1.default(404, 'Mentor not found!!');
    }
    return mentorRegistration[0];
});
const getAdminMentorQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const mentorRegistrationQuery = new QueryBuilder_1.default(mentorRegistration_model_1.MentorRegistration.find({}).populate('mentorId'), query)
        .search(['fullName'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield mentorRegistrationQuery.modelQuery;
    const meta = yield mentorRegistrationQuery.countTotal();
    return { meta, result };
});
const getMentorRegistrationOnly = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mentor = yield user_models_1.User.findById(id).populate({
        path: 'mentorRegistrationId',
        populate: { path: 'mentorId' },
    });
    if (!mentor) {
        throw new AppError_1.default(404, 'Mentor is Not Found!!');
    }
    if (!(mentor === null || mentor === void 0 ? void 0 : mentor.mentorRegistrationId)) {
        throw new AppError_1.default(404, 'Mentor Registration is Not Found!!');
    }
    return mentor === null || mentor === void 0 ? void 0 : mentor.mentorRegistrationId;
});
const updateMentorRegistrationQuery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Start a session for the transaction
    const session = yield mentorRegistration_model_1.MentorRegistration.startSession();
    session.startTransaction();
    try {
        // console.log('payload', payload);
        // Find the mentor registration
        const registerMentor = yield mentorRegistration_model_1.MentorRegistration.findById(id).session(session);
        if (!registerMentor) {
            throw new AppError_1.default(404, 'Register Mentor Not Found!!');
        }
        // Update the mentor registration with the payload
        const mentorRegistration = yield mentorRegistration_model_1.MentorRegistration.findByIdAndUpdate(id, payload, { new: true, session });
        // If there's an image in the payload, update the related user
        let image = null;
        if ((payload === null || payload === void 0 ? void 0 : payload.image) || payload.fullName) {
            const userData = {};
            if (payload.fullName) {
                userData.fullName = payload.fullName;
            }
            if (payload.image) {
                userData.image = payload.image;
            }
            let user;
            // Ensure the mentorId exists before trying to update the user
            if (registerMentor.mentorId) {
                user = yield user_models_1.User.findByIdAndUpdate(registerMentor.mentorId, userData, { new: true, session });
                image = user === null || user === void 0 ? void 0 : user.image;
            }
            else {
                console.log('mentorId not found for the mentor');
            }
        }
        //  const image = user ? user.image : null;
        // const image = user === null ? null : user.image;
        // Commit the transaction if everything is successful
        yield session.commitTransaction();
        session.endSession();
        // Return the updated mentor registration
        return { mentorRegistration, image };
    }
    catch (error) {
        // Rollback the transaction in case of any error
        yield session.abortTransaction();
        session.endSession();
        // Log or throw error
        console.error('Error during mentor registration update:', error);
        throw error;
    }
});
const acceptSingleMentorRegistrationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        console.log('id id', id);
        const registerMentor = yield mentorRegistration_model_1.MentorRegistration.findById(id).session(session);
        if (!registerMentor) {
            throw new AppError_1.default(404, 'Register Mentor Not Found!!');
        }
        const mentor = yield user_models_1.User.findById(registerMentor.mentorId).session(session);
        if (!mentor) {
            throw new AppError_1.default(404, 'Mentor Not Found!!');
        }
        const mentorRegistration = yield mentorRegistration_model_1.MentorRegistration.findByIdAndUpdate(id, { status: 'accept' }, { new: true, session });
        const updatedMentor = yield user_models_1.User.findByIdAndUpdate(registerMentor.mentorId, { mentorRegistrationId: mentorRegistration._id }, { new: true, session });
        const addWallet = yield wallet_service_1.walletService.addWalletService(mentor._id, session);
        if (!addWallet) {
            throw new AppError_1.default(404, 'Wallet Not Found!!');
        }
        console.log('before send email');
        yield (0, mentorRegistration_utils_1.acceptanceRegistrationEmail)({
            sentTo: mentorRegistration.email,
            subject: 'Mentor Registration Accepted!!',
            name: mentorRegistration.fullName,
        });
        console.log('after send email');
        yield session.commitTransaction();
        session.endSession();
        return mentorRegistration;
    }
    catch (error) {
        console.error('Transaction Error:', error);
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cencelSingleMentorRegistrationService = (id, rejone) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('rejone ---1', rejone);
    const registerMentor = yield mentorRegistration_model_1.MentorRegistration.findById(id);
    if (!registerMentor) {
        throw new AppError_1.default(404, 'Register Mentor Not Found!!');
    }
    if (registerMentor.status === 'cenceled') {
        throw new AppError_1.default(404, 'Register Already is cenceled !!');
    }
    const mentorRegistration = yield mentorRegistration_model_1.MentorRegistration.findByIdAndUpdate(id, { status: 'cenceled' }, { new: true });
    if (!mentorRegistration) {
        throw new AppError_1.default(404, 'Failed to cencel Mentor Registration!');
    }
    // Send cancellation email
    try {
        yield (0, mentorRegistration_utils_1.cancellationRegistrationEmail)({
            sentTo: mentorRegistration.email,
            subject: 'Mentor Registration Cancellation!!',
            name: mentorRegistration.fullName,
            rejone,
        });
        console.log('Cancellation email sent successfully');
    }
    catch (error) {
        console.error('Error sending cancellation email:', error);
        throw new AppError_1.default(500, 'Failed to send cancellation email');
    }
    return mentorRegistration;
});
exports.mentorRegistrationService = {
    createMentorRegistrationService,
    getAllMentorRegistrationQuery,
    getMentorAvailableSlots,
    getMentorRegistrationOnly,
    getAdminMentorQuery,
    getSingleMentorRegistrationQuery,
    updateMentorRegistrationQuery,
    acceptSingleMentorRegistrationService,
    cencelSingleMentorRegistrationService,
};
