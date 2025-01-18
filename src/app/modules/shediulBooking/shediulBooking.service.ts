import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TShedualBooking } from './shediulBooking.interface';
import ScheduleBooking from './shediulBooking.model';
import moment from 'moment';
import { User } from '../user/user.models';
import { generateZoomMeetingLink } from './shediulBooking.utils';

const createMentorBookingService = async (payload: TShedualBooking) => {
  const { bookingDate, startTime, endTime, mentorId } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
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

    // Create the booking
    const result = await ScheduleBooking.create([payload], { session });
    if (!result[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add booking');
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
    const meetingLink = await generateZoomMeetingLink(meetingData);
    // console.log('......error......2...');
    // console.log('meetingLink', meetingLink);
    // console.log('......error.......3..');

    if (!meetingLink) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add booking');
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
       await ScheduleBooking.findOneAndUpdate(
         { _id: result[0]._id },
         { zoomMeetingId: {
           meetingLink: meetingLink.meetingLink,
           startTime: meetingLink.startTime,
           endTime: meetingLink.endTime,
           agenda: meetingLink.agenda
         } },
         { new: true, session }, // Pass session to ensure it's part of the transaction
       );
     }

     // console.log('......error....5.....');

     // console.log('result booking', result[0]);
    // // console.log(meetingDetails);
    await session.commitTransaction();
     session.endSession();
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
    
  }
};

const reSheduleMentorBookingService = async (id: string, payload: TShedualBooking) => {
  const { bookingDate, startTime, endTime, mentorId } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    
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

  // console.log('updateReSheduleData', updateReSheduleData);
  const result = await ScheduleBooking.findOneAndUpdate(
    { _id: id },
    updateReSheduleData,
    {
      new: true, session
    },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add booking');
  }

  // Generate Zoom meeting link after the booking is created
  const meetingData = {
    topic: 'Mentoring Service Meeting',
    agenda: 'Discuss Services',
    start_time: result.startTime,
    duration: result.duration,
  };

  // Example usage
  const meetingLink = await generateZoomMeetingLink(meetingData);

  if (!meetingLink) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add booking');
  }


  if (meetingLink) {
    // Update the booking with the Zoom meeting ID in the same transaction
    await ScheduleBooking.findOneAndUpdate(
      { _id: result._id },
      {
        zoomMeetingId: {
          meetingLink: meetingLink.meetingLink,
          startTime: meetingLink.startTime,
          endTime: meetingLink.endTime,
          agenda: meetingLink.agenda,
        },
      },
      { new: true, session }, // Pass session to ensure it's part of the transaction
    );
  }

  await session.commitTransaction();
  session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  
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
  // console.log('query', query);
  
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
