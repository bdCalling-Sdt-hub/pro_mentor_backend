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
exports.paymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const payment_model_1 = require("./payment.model");
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const shediulBooking_service_1 = require("../shediulBooking/shediulBooking.service");
const notification_service_1 = require("../notification/notification.service");
const wallet_model_1 = require("../wallet/wallet.model");
const addPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId, menteeId, sheduleBookingId, amount, method, bankDetails, paypalPayDetails, applePayDetails, transactionId, transactionDate, bookingDate, bookingTime, duration, subject, jobTitle, industryField, yearOfExperience, educationLevel, description, } = payload;
    console.log('......payload......');
    const status = 'pending';
    const paymentData = {
        mentorId,
        menteeId,
        sheduleBookingId,
        amount,
        method,
        status,
        bankDetails,
        paypalPayDetails,
        applePayDetails,
        transactionId,
        transactionDate,
    };
    console.log('......paymentData......');
    // Start a session for transaction
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        console.log('......try......');
        // Validate mentor
        const mentor = yield user_models_1.User.findById(mentorId).session(session);
        console.log('mentor', mentor);
        if (!mentor) {
            throw new AppError_1.default(400, 'Mentor is not found!');
        }
        if (mentor.role !== 'mentor') {
            throw new AppError_1.default(400, 'User is not authorized as a Mentor!');
        }
        // Validate mentee
        const mentee = yield user_models_1.User.findById(menteeId).session(session);
        console.log('mentee', mentee);
        if (!mentee) {
            throw new AppError_1.default(400, 'Mentee is not found!');
        }
        if (mentee.role !== 'mentee') {
            throw new AppError_1.default(400, 'User is not authorized as a Mentee');
        }
        // Validate Payment Amount
        if (!amount || amount <= 0) {
            throw new AppError_1.default(400, 'Invalid Paymental amount. It must be a positive number.');
        }
        // Validate Payment Method
        const validMethods = ['bank', 'paypal_pay', 'apple_pay'];
        if (!method || !validMethods.includes(method)) {
            throw new AppError_1.default(400, 'Invalid Paymental method.');
        }
        // Method-specific validation
        if (method === 'bank') {
            if (!bankDetails || !bankDetails.accountPiNumber) {
                throw new AppError_1.default(400, 'All bank details (account number, account name, bank name) are required for bank Paymentals.');
            }
        }
        else if (method === 'paypal_pay') {
            if (!paypalPayDetails || !paypalPayDetails.paypalId) {
                throw new AppError_1.default(400, 'Paypal Pay token is required for Paypal Pay Paymentals.');
            }
        }
        else if (method === 'apple_pay') {
            if (!applePayDetails || !applePayDetails.appleId) {
                throw new AppError_1.default(400, 'Apple Pay token is required for Apple Pay Paymentals.');
            }
        }
        // Create payment record
        const result = yield payment_model_1.Payment.create([paymentData], { session });
        console.log('result', result);
        if (!result || !result[0]) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add Payment!');
        }
        // i want to add property adminAmount 10% of amount
        const adminAmount = (amount * 10) / 100;
        yield payment_model_1.Payment.updateOne({ _id: result[0]._id }, { adminAmount }, { session });
        // Time calculation for booking
        const startTimeOld = (0, moment_1.default)(bookingTime, 'hh:mm A');
        const endTimeOld = startTimeOld.clone().add(duration - 1, 'minutes');
        const startTime = startTimeOld.format('hh:mm A');
        const endTime = endTimeOld.format('hh:mm A');
        // Booking data
        const bookingData = {
            mentorId,
            menteeId,
            bookingDate,
            bookingTime,
            duration,
            startTime,
            endTime,
            status: 'Booked',
            subject,
            jobTitle,
            industryField,
            yearOfExperience,
            educationLevel,
            description,
        };
        console.log('bookingData', bookingData);
        const bookingResult = yield shediulBooking_service_1.mentorBookingService.createMentorBookingService(bookingData);
        if (!bookingResult) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add Booking!');
        }
        yield payment_model_1.Payment.updateOne({ _id: result[0]._id }, { sheduleBookingId: bookingResult._id }, { session });
        const mentorWallet = yield wallet_model_1.Wallet.findOne({ mentorId }).session(session);
        if (!mentorWallet) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Mentor wallet not found!');
        }
        const walletUpdateAmount = amount - adminAmount;
        yield wallet_model_1.Wallet.updateOne({ _id: mentorWallet._id }, { $inc: { amount: walletUpdateAmount } }, { session });
        /// notification for mentor
        const notificationData1 = {
            userId: mentor._id,
            message: `Shedule booking successful!`,
            type: 'success',
        };
        const notificationData2 = {
            userId: mentee._id,
            message: `Shedule booking successful!`,
            type: 'success',
        };
        const notificationData3 = {
            role: 'admin',
            message: `Shedule booking successful!`,
            type: 'success',
        };
        const notificationResult1 = yield notification_service_1.notificationService.createNotification(notificationData1, session);
        const notificationResult2 = yield notification_service_1.notificationService.createNotification(notificationData2, session);
        const notificationResult3 = yield notification_service_1.notificationService.createNotification(notificationData3, session);
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        console.error('Transaction Error:', error);
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// const addPaymentService = async (payload: any) => {
//   const {
//     mentorId,
//     menteeId,
//     sheduleBookingId,
//     amount,
//     method,
//     bankDetails,
//     paypalPayDetails,
//     applePayDetails,
//     transactionId,
//     transactionDate,
//     bookingDate,
//     bookingTime,
//     duration,
//   } = payload;
//   const status = 'pending';
//   const paymentData = {
//     mentorId,
//     menteeId,
//     sheduleBookingId,
//     amount,
//     method,
//     status,
//     bankDetails,
//     paypalPayDetails,
//     applePayDetails,
//     transactionId,
//     transactionDate,
//   };
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const mentor = await User.findById(payload.mentorId);
//     console.log('.....try-1.......');
//     if (!mentor) {
//       throw new AppError(400, 'Mentor is not found!');
//     }
//     if (mentor.role !== 'mentor') {
//       throw new AppError(400, 'User is not authorized as a Mentor!');
//     }
//     console.log('.....try-2.......');
//     // console.log(paymentData);
//     const result = await Payment.create([paymentData], { session });
//     // const result = await Payment.create([paymentData], { session });
//     console.log('result', result);
//     console.log('.....try-3.......');
//     // const result = await Order.create([data], { session });
//     // if (!result.length) {
//     //   throw new Error('Failed to payment');
//     // }
//     // const userUpdate = await User.findOneAndUpdate(
//     //   { _id: payload.mentorId },
//     //   { mentorRegistrationId: payload.mentorId },
//     //   { session },
//     // );
//     // if (!userUpdate) {
//     //   throw new Error('Failed to update');
//     // }
//     await session.commitTransaction();
//     await session.endSession();
//     return result[0];
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error('Failed to payment!!');
//   }
// };
// const addPaymentService = async (payload: any) => {
//   const {
//     mentorId,
//     menteeId,
//     sheduleBookingId,
//     amount,
//     method,
//     bankDetails,
//     paypalPayDetails,
//     applePayDetails,
//     transactionId,
//     transactionDate,
//     bookingDate,
//     bookingTime,
//     duration,
//   } = payload;
//   const status = 'pending';
//   const paymentData = {
//     mentorId,
//     menteeId,
//     sheduleBookingId,
//     amount,
//     method,
//     status,
//     bankDetails,
//     paypalPayDetails,
//     applePayDetails,
//     transactionId,
//     transactionDate,
//   };
//     const mentor = await User.findById(payload.mentorId);
//     console.log('.....try-1.......');
//     if (!mentor) {
//       throw new AppError(400, 'Mentor is not found!');
//     }
//     if (mentor.role !== 'mentor') {
//       throw new AppError(400, 'User is not authorized as a Mentor!');
//     }
//     console.log('.....try-2.......');
//     console.log(paymentData);
//     const result = await Payment.create(paymentData);
//     // console.log('result', result);
//     console.log('.....try-3.......');
//     // const result = await Order.create([data], { session });
//     if (!result) {
//       throw new Error('Failed to payment');
//     }
//     const userUpdate = await User.findOneAndUpdate(
//       { _id: payload.mentorId },
//       { mentorRegistrationId: payload.mentorId },
//     );
//     if (!userUpdate) {
//       throw new Error('Failed to update');
//     }
//     return result;
// };
const getAllPaymentService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentQuery = new QueryBuilder_1.default(payment_model_1.Payment.find()
        .populate('mentorId')
        .populate('menteeId')
        .populate('sheduleBookingId'), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield PaymentQuery.modelQuery;
    const meta = yield PaymentQuery.countTotal();
    return { meta, result };
});
const getAllPaymentByMentorService = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentQuery = new QueryBuilder_1.default(payment_model_1.Payment.find({ mentorId }), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield PaymentQuery.modelQuery;
    const meta = yield PaymentQuery.countTotal();
    return { meta, result };
});
const singlePaymentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield payment_model_1.Payment.findById(id);
    return task;
});
const getAllEarningAmountService = () => __awaiter(void 0, void 0, void 0, function* () {
    // Use .lean() to get plain objects instead of Mongoose documents
    const payments = yield payment_model_1.Payment.find().lean();
    const totalEarnings = payments.reduce((total, payment) => {
        return total + (payment.amount || 0); // Ensure amount is a number
    }, 0);
    const currentDate = new Date();
    const todayEarnings = payments.reduce((total, payment) => {
        const paymentDate = new Date(payment.createdAt);
        if (paymentDate.toDateString() === currentDate.toDateString()) {
            return total + (payment.amount || 0);
        }
        return total;
    }, 0); // Ensure initialization of reduce with 0
    return { totalEarnings, todayEarnings };
});
const deleteSinglePaymentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.deleteOne({ _id: id });
    return result;
});
exports.paymentService = {
    addPaymentService,
    getAllPaymentService,
    singlePaymentService,
    deleteSinglePaymentService,
    getAllPaymentByMentorService,
    getAllEarningAmountService,
};
