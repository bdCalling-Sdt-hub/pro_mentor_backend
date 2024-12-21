import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { Payment } from './payment.model';
import httpStatus from 'http-status';
import moment from 'moment';
import { mentorBookingService } from '../shediulBooking/shediulBooking.service';
import { notificationService } from '../notification/notification.service';
import { Wallet } from '../wallet/wallet.model';

const addPaymentService = async (payload: any) => {
  const {
    mentorId,
    menteeId,
    sheduleBookingId,
    amount,
    method,
    bankDetails,
    paypalPayDetails,
    applePayDetails,
    transactionId,
    transactionDate,
    bookingDate,
    bookingTime,
    duration,
    subject,
    jobTitle,
    industryField,
    yearOfExperience,
    educationLevel,
    description,
  } = payload;

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('......try......');
    // Validate mentor
    const mentor = await User.findById(mentorId).session(session);
    console.log('mentor', mentor);
    if (!mentor) {
      throw new AppError(400, 'Mentor is not found!');
    }
    if (mentor.role !== 'mentor') {
      throw new AppError(400, 'User is not authorized as a Mentor!');
    }

    // Validate mentee
    const mentee = await User.findById(menteeId).session(session);
    console.log('mentee', mentee);
    if (!mentee) {
      throw new AppError(400, 'Mentee is not found!');
    }
    if (mentee.role !== 'mentee') {
      throw new AppError(400, 'User is not authorized as a Mentee');
    }

    // Validate Payment Amount
    if (!amount || amount <= 0) {
      throw new AppError(
        400,
        'Invalid Paymental amount. It must be a positive number.',
      );
    }

    // Validate Payment Method
    const validMethods = ['bank', 'paypal_pay', 'apple_pay'];
    if (!method || !validMethods.includes(method)) {
      throw new AppError(400, 'Invalid Paymental method.');
    }

    // Method-specific validation
    if (method === 'bank') {
      if (
        !bankDetails ||
        !bankDetails.accountNumber ||
        !bankDetails.accountName ||
        !bankDetails.bankName
      ) {
        throw new AppError(
          400,
          'All bank details (account number, account name, bank name) are required for bank Paymentals.',
        );
      }
    } else if (method === 'paypal_pay') {
      if (!paypalPayDetails || !paypalPayDetails.paypalId) {
        throw new AppError(
          400,
          'Paypal Pay token is required for Paypal Pay Paymentals.',
        );
      }
    } else if (method === 'apple_pay') {
      if (!applePayDetails || !applePayDetails.appleId) {
        throw new AppError(
          400,
          'Apple Pay token is required for Apple Pay Paymentals.',
        );
      }
    }

    // Create payment record
    const result = await Payment.create([paymentData], { session });
    console.log('result', result);
    if (!result || !result[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add Payment!');
    }

    // i want to add property adminAmount 10% of amount
    const adminAmount = (amount * 10) / 100;
    await Payment.updateOne(
      { _id: result[0]._id },
      { adminAmount },
      { session },
    );

    // Time calculation for booking
    const startTimeOld = moment(bookingTime, 'hh:mm A');
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

    const bookingResult =
      await mentorBookingService.createMentorBookingService(bookingData);
    if (!bookingResult) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add Booking!');
    }

    await Payment.updateOne(
      { _id: result[0]._id },
      { sheduleBookingId: bookingResult._id },
      { session },
    );

    const mentorWallet = await Wallet.findOne({ mentorId }).session(session);
    if (!mentorWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Mentor wallet not found!');
    }

    const walletUpdateAmount = amount - adminAmount;
    await Wallet.updateOne(
      { _id: mentorWallet._id },
      { $inc: { amount: walletUpdateAmount } },
      { session },
    );
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
      type:'success',
    };

    const notificationResult1 = await notificationService.createNotification(
      notificationData1,
      session,
    );
    const notificationResult2 = await notificationService.createNotification(
      notificationData2,
      session,
    );
    const notificationResult3 = await notificationService.createNotification(
      notificationData3,
      session,
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    console.error('Transaction Error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};




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

const getAllPaymentService = async (query: Record<string, unknown>) => {
  const PaymentQuery = new QueryBuilder(
    Payment.find()
      .populate('mentorId')
      .populate('menteeId')
      .populate('sheduleBookingId'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();
  return { meta, result };
};
const getAllPaymentByMentorService = async (
  query: Record<string, unknown>,
  mentorId: string,
) => {
  const PaymentQuery = new QueryBuilder(Payment.find({ mentorId }), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();
  return { meta, result };
};

const singlePaymentService = async (id: string) => {
  const task = await Payment.findById(id);
  return task;
};

const getAllEarningAmountService = async () => {
  // Use .lean() to get plain objects instead of Mongoose documents
  const payments = await Payment.find().lean();

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
};



const deleteSinglePaymentService = async (id: string) => {
  const result = await Payment.deleteOne({ _id: id });
  return result;
};

export const paymentService = {
  addPaymentService,
  getAllPaymentService,
  singlePaymentService,
  deleteSinglePaymentService,
  getAllPaymentByMentorService,
  getAllEarningAmountService,
};
