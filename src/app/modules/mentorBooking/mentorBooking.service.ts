import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TMentorBooking } from './mentorBooking.interface';
import MentorBooking from './mentorBooking.model';
import { notificationService } from '../notification/notification.service';
import { sendEmail } from '../../utils/mailSender';
import { acceptanceRegistrationEmail, cancellationRegistrationEmail } from './mentorBooking.utils';


const createMentorBookingService = async (payload: TMentorBooking) => {
  const session = await mongoose.startSession(); 
  session.startTransaction(); 

  try {
    console.log('payload', payload);

    const result = await MentorBooking.create([payload], { session });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to add Mentor Booking!!',
      );
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

    const notificationResult = await notificationService.createNotification(
      notificationData,
      session,
    );
    const notificationResult2 = await notificationService.createNotification(
      notificationData2,
      session,
    );

    if (!notificationResult || !notificationResult2) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create notification',
      );
    }
    
    await session.commitTransaction();
    session.endSession();

    return result; 
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in createMentorBookingService:', error);
    session.endSession(); 
    throw error; 
  }
};


const getAllMentorBookingByIdQuery = async (
  query: Record<string, unknown>,
  mentorId: string,
) => {
  const BookingQuery = new QueryBuilder(
    MentorBooking.find({ mentorId }).populate('mentorId').populate('menteeId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await BookingQuery.modelQuery;
  const meta = await BookingQuery.countTotal();
  return { meta, result };
};

const getAllMenteeBookingByQuery = async (
  query: Record<string, unknown>,
  menteeId: string,
) => {
    console.log('menteeId', menteeId);
  const bookingQuery = new QueryBuilder(
    MentorBooking.find({ menteeId }).populate('menteeId').populate('mentorId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookingQuery.modelQuery;
  const meta = await bookingQuery.countTotal();
  return { meta, result };
};

const getSingleMentorBookingQuery = async (id: string) => {
  const mentorBooking = await MentorBooking.findById(id);
  if (!mentorBooking) {
    throw new AppError(404, 'Mentor Booking Not Found!!');
  }
  const result = await MentorBooking.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (result.length === 0) {
    throw new AppError(404, 'Mentor Booking not found!');
  }

  return result[0];
};


const acceptMentorBookingQuery = async (id: string) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start the transaction

  try {
    // Find the mentor booking by ID inside the transaction
    const mentorBooking = await MentorBooking.findById(id).session(session);

    if (!mentorBooking) {
      throw new AppError(404, 'Mentor Booking Not Found!!');
    }

    // Update the mentor booking status to 'accepted'
    const result = await MentorBooking.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { new: true, session }, // Pass session to ensure the update is part of the transaction
    );

    if (!result) {
      throw new AppError(404, 'Failed to accept Mentor Booking!');
    }


    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    console.error('Error in acceptMentorBookingQuery:', error);
    session.endSession(); // End the session after abort
    throw error; // Rethrow the error after handling
  }
};



const cencelMentorBookingQuery = async (id: string) => {
 
  const mentorBooking = await MentorBooking.findById(id);
  if (!mentorBooking) {
    throw new AppError(404, 'Mentor Booking  Not Found!!');
  }
  const result = await MentorBooking.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(404, 'Failed to cencel Mentor Booking!');
  }

  return result;
};

export const mentorBookingService = {
  createMentorBookingService,
  getAllMentorBookingByIdQuery,
  getAllMenteeBookingByQuery,
  getSingleMentorBookingQuery,
  acceptMentorBookingQuery,
  cencelMentorBookingQuery,
};
