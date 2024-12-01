import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TShedualBooking } from './shediulBooking.interface';
import ScheduleBooking from './shediulBooking.model';
import moment from 'moment';
import { User } from '../user/user.models';

const createMentorBookingService = async (payload: TShedualBooking) => {
  const { bookingDate, startTime, endTime, mentorId } = payload;

  const isValidTimeFormat = (time: string) =>
    moment(time, 'hh:mm A', true).isValid();
  if (
    typeof startTime !== 'string' ||
    typeof endTime !== 'string' ||
    !isValidTimeFormat(startTime) ||
    !isValidTimeFormat(endTime)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid time format for start or end time',
    );
  }

  const existingBooking = await ScheduleBooking.findOne({
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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Booking time is overlapping with an existing booking',
    );
  }
  const result = await ScheduleBooking.create(payload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add booking');
  }

  return result;
};

const reSheduleMentorBookingService = async (id: string, payload: TShedualBooking) => {
  const { bookingDate, startTime, endTime, mentorId } = payload;

  const isValidTimeFormat = (time: string) =>
    moment(time, 'hh:mm A', true).isValid();
  if (
    typeof startTime !== 'string' ||
    typeof endTime !== 'string' ||
    !isValidTimeFormat(startTime) ||
    !isValidTimeFormat(endTime)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid time format for start or end time',
    );
  }

  const existingBooking = await ScheduleBooking.findOne({
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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Booking time is overlapping with an existing booking',
    );
  }

  const updateReSheduleData = {
    bookingDate: payload.bookingDate,
    bookingTime: payload.bookingTime,
    startTime: payload.startTime,
    endTime: payload.endTime,
  };

    console.log('updateReSheduleData', updateReSheduleData);
  const result = await ScheduleBooking.findOneAndUpdate(
    { _id: id },
    updateReSheduleData,
    {
      new: true,}
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add booking');
  }

  return result;
};

const getSingleMentorBookingAvailableTimeSlotsQuery = async (id: string) => {
  const booking = await ScheduleBooking.findById(id);
  if (!booking) {
    throw new AppError(404, 'Booking Not Found!!');
  }
  const mentorBooking = await ScheduleBooking.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (mentorBooking.length === 0) {
    throw new AppError(404, 'Booking not found!');
  }

  return mentorBooking[0];
};

const getAllMentorBookingByQuery = async (
  query: Record<string, unknown>,
  mentorId: string,
  menteeId: string,
) => {
  const BookingQuery = new QueryBuilder(
    ScheduleBooking.find({ mentorId, menteeId }).populate('menteeId'),
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

// akhane all mentor ke get kora hoase jara ai mentee ke booking korese
const getAllMentorByMenteeBookingByQuery = async (
  query: Record<string, unknown>,
  mentorId: string
) => {
  const BookingQuery = new QueryBuilder(
    ScheduleBooking.find({ mentorId }).populate('mentorId').populate('menteeId'),
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

// akhane all mentee ke get kora hoase jara ai mentor ke booking korese
const getAllMenteeByMentorBookingByQuery = async (
  query: Record<string, unknown>,
  menteeId: string,
) => {
  const BookingQuery = new QueryBuilder(
    ScheduleBooking.find({ menteeId }).populate('mentorId'),
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
  mentorId: string,
) => {
  const bookingQuery = new QueryBuilder(
    ScheduleBooking.find({ menteeId,mentorId }).populate('mentorId'),
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
  const booking = await ScheduleBooking.findById(id);
  if (!booking) {
    throw new AppError(404, 'Booking Not Found!!');
  }
  const mentorBooking = await ScheduleBooking.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (mentorBooking.length === 0) {
    throw new AppError(404, 'Booking not found!');
  }

  return mentorBooking[0];
};

const updateMentorBookingQuery = async (
  id: string,
  payload: Partial<TShedualBooking>,
) => {
  const bookingMentor = await ScheduleBooking.findById(id);
  if (!bookingMentor) {
    throw new AppError(404, 'Booking Not Found!!');
  }
  const result = await ScheduleBooking.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deletedMentorBookingQuery = async (id: string) => {
  const booking = await ScheduleBooking.findById(id);
  if (!booking) {
    throw new AppError(404, 'Booking  Not Found!!');
  }
  const result = await ScheduleBooking.findOneAndDelete({ _id: id });

  return result;
};

export const mentorBookingService = {
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
