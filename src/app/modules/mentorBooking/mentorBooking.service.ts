import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TMentorBooking } from './mentorBooking.interface';
import MentorBooking from './mentorBooking.model';


const createMentorBookingService = async (payload: TMentorBooking) => {
  console.log('payuload', payload);

  const result = await MentorBooking.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Mentor Booking added!!');
  }

  return result;
};

const getAllMentorBookingByIdQuery = async (
  query: Record<string, unknown>,
  mentorId: string,
) => {
  const BookingQuery = new QueryBuilder(
    MentorBooking.find({ mentorId }).populate('mentorId'),
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
    MentorBooking.find({ menteeId }).populate('menteeId'),
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
  const mentorBooking = await MentorBooking.findById(id);
  if (!mentorBooking) {
    throw new AppError(404, 'Mentor Booking  Not Found!!');
  }
  const result = await MentorBooking.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });

  return result;
};


const cencelMentorBookingQuery = async (id: string) => {
  const mentorBooking = await MentorBooking.findById(id);
  if (!mentorBooking) {
    throw new AppError(404, 'Mentor Booking  Not Found!!');
  }
  const result = await MentorBooking.findByIdAndDelete(id);

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
