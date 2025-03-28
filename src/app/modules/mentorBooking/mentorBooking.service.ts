import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TMentorBooking } from './mentorBooking.interface';
import MentorBooking from './mentorBooking.model';
import { notificationService } from '../notification/notification.service';
import { sendEmail } from '../../utils/mailSender';
import {
  acceptanceRegistrationEmail,
  cancellationRegistrationEmail,
} from './mentorBooking.utils';
import { populate } from 'dotenv';
import { User } from '../user/user.models';
import { MentorRegistration } from '../mentorRegistration/mentorRegistration.model';


interface MentorId {
  mentorRegistrationId: Types.ObjectId;
}


const createMentorBookingService = async (payload: TMentorBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // console.log('payload', payload);

    if (!payload.mentorId || !payload.menteeId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Mentor or Mentee not found!');
    }

    const isBookingExist = await MentorBooking.findOne({
      mentorId: payload.mentorId,
      menteeId: payload.menteeId,
    })
      .session(session)
      .lean();

    if (isBookingExist) { // Check if a booking already exists for the same mentor and mentee
      throw new AppError(httpStatus.BAD_REQUEST, 'Mentor Booking already exists!');
    }

    const result = await MentorBooking.create([payload], { session });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to add Mentor Booking!!',
      );
    }

    const notificationData = {
      userId: result[0].mentorId,
      message: `Booking mentee is successful!`,
      type: 'success',
    };
    const notificationData2 = {
      userId: result[0].menteeId,
      message: `Booking mentor is successful!`,
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
  // console.log('mentorId', mentorId);
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
  // console.log('menteeId', menteeId);

  // Create the base query using QueryBuilder
  const bookingQuery = new QueryBuilder(
    MentorBooking.find({ menteeId }).populate('mentorId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  // Execute the query to fetch bookings
  const result = await bookingQuery.modelQuery;
  // console.log({result})

  // Now populate 'mentorRegistrationId' for each mentorId
  for (let booking of result) {
    if (booking && booking.mentorId) {
      await booking.populate('mentorId.mentorRegistrationId');
    }
  }

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
  const session = await mongoose.startSession(); 
  session.startTransaction(); 

  try {
    const mentorBooking = await MentorBooking.findById(id)
      .populate({
        path: 'mentorId', 
        populate: { path: 'mentorRegistrationId' }, 
      })
      .session(session);

    if (!mentorBooking) {
      throw new AppError(404, 'Mentor Booking Not Found!!');
    }
 
    //  const mentorRegistrationIDD = mentorBooking.mentorId?.mentorRegistrationId;

       const mentorRegistrationIDD = (
         mentorBooking.mentorId as unknown as MentorId
       )?.mentorRegistrationId;
 
    // Update the mentor booking status to 'accepted'
    const result = await MentorBooking.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(404, 'Failed to update Mentor Booking status!');
    }

    // Retrieve the mentor registration to increment the membership count
    const mentorRegistration = await MentorRegistration.findById(
      mentorRegistrationIDD,
    ).session(session); // Ensure mentorRegistration update is part of the session

    if (!mentorRegistration) {
      throw new AppError(404, 'Mentor Registration Not Found!!');
    }

    // Update the mentor registration (increment membership count)
    const result2 = await MentorRegistration.findByIdAndUpdate(
      mentorRegistrationIDD, // Use the correct mentor registration ID here
      { membershipCount: (mentorRegistration.membershipCount || 0) + 1 },
      { new: true, session }, // Ensure this update is part of the transaction
    );

    if (!result2) {
      throw new AppError(
        404,
        'Failed to update Mentor Registration membership count!',
      );
    }

    const notificationData = {
      userId: result.menteeId,
      message: `Booking Accept is successful!`,
      type: 'success',
    };
   

    const notificationResult = await notificationService.createNotification(
      notificationData,
      session,
    );


    if (!notificationResult) {
      throw new AppError(403, 'Notification send faield');
    }



    // Commit the transaction after all updates succeed
    await session.commitTransaction();
    session.endSession();

    return result; // Return the updated mentor booking status
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
  // console.log('id ', id);
  // console.log('mentorBooking ', mentorBooking);
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
