import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.models';
import { TMentorRegistration } from './mentorRegistration.interface';
import { MentorRegistration } from './mentorRegistration.model';
import { userService } from '../user/user.service';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { walletService } from '../wallet/wallet.service';
import {
  acceptanceRegistrationEmail,
  cancellationRegistrationEmail,
  generateAvailableSlots,
  isTimeOverlap,
} from './mentorRegistration.utils';
import ScheduleBooking from '../shediulBooking/shediulBooking.model';
import moment from 'moment';
import { notificationService } from '../notification/notification.service';
import MentorShediulPricing from '../mentorShediulPricing/mentorShediulPricing.model';

const createMentorRegistrationService = async (
  payload: TMentorRegistration,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // // console.log('payload payload payload', payload);
  // console.log('............service 1............')

  try {
    const user = await User.findById(payload.mentorId).session(session);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!!');
    }

    // console.log({ payload });

    const result = await MentorRegistration.create([payload], { session });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create mentor registration',
      );
    }

    const notificationData = {
      userId: result[0].mentorId._id,
      role: 'admin',
      message: `Mentor Registration is successful!`,
      type: 'success',
    };

    const notificationResult = await notificationService.createNotification(
      notificationData,
      session,
    );

    if (!notificationResult) {
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
    console.error('Error in createMentorRegistrationService:', error);
    session.endSession();
    throw error;
  }
};

const getAllMentorRegistrationQuery = async (
  query: Record<string, unknown>,
) => {
  // console.log('query -----11111', query);

  const { availableTime, searchTerm, sort, page, limit, ...filters }: any =
    query;

  let queryStart = '';
  let queryEnd = '';
  if (availableTime) {
    const [queryTimeStart, queryTimeEnd] = availableTime.split(' - ');
    queryStart = queryTimeStart;
    queryEnd = queryTimeEnd;
  }

  let queryConditions: Record<string, any> = {};
  // console.log('queryConditions 1', queryConditions);

  // if (searchTerm) {
  //   queryConditions.$text = { $search: String(searchTerm) };
  // }
  // // console.log('queryConditions 2', queryConditions);


  // if (searchTerm) {
  //   queryConditions.$or = [
  //     { fullName: { $regex: searchTerm, $options: 'i' } },
  //     { industryExpertise: { $regex: searchTerm, $options: 'i' } },
  //     { specializedSkill: { $regex: searchTerm, $options: 'i' } },
  //   ];
  // }

  if (searchTerm) {
    queryConditions.$or = [
      { fullName: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      queryConditions[key] = value;
    }
  }

  // console.log('queryConditions 3', queryConditions);

  // Count total matching documents
  const total = await MentorRegistration.countDocuments(queryConditions);

  let mentorRegistrations = await MentorRegistration.find(queryConditions)
    .populate('mentorId')
    .sort('-reviewCount')
    .exec();

  if (queryStart && queryEnd) {
    mentorRegistrations = mentorRegistrations.filter((mentor: any) => {
      if (!mentor.availableTime) return false;

      const [mentorStart, mentorEnd] = mentor.availableTime.split(' - ');

      if (!mentorStart || !mentorEnd) return false;

      return isTimeOverlap(mentorStart, mentorEnd, queryStart, queryEnd);
    });
  }

  if (sort) {
    // console.log('sort', sort);
    const sortFields = sort
      .split(',')
      .reduce((acc: Record<string, number>, field: string) => {
        const direction = field.startsWith('-') ? -1 : 1;
        const fieldName = field.startsWith('-') ? field.substring(1) : field;
        acc[fieldName] = direction;
        return acc;
      }, {});

    // console.log('sortFields', sortFields);

    mentorRegistrations = await MentorRegistration.find(queryConditions)
      .populate('mentorId')
      .sort(sortFields)
      .exec();
  }

  const pageNumber = parseInt(String(page), 10) || 1;
  const limitNumber = parseInt(String(limit), 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const paginatedResults = mentorRegistrations.slice(skip, skip + limitNumber);
  // console.log({ paginatedResults });

  const totalPage = Math.ceil(total / limitNumber);

  return {
    meta: {
      total: mentorRegistrations.length,
      page: pageNumber,
      limit: limitNumber,
      totalPage,
    },
    result: paginatedResults,
  };
};

// 67580e3576453bd8b1d4995d
// 675c0c3c42b6ee5ab9c6142a
// 6766a7755c0e9cf78f46838f
// 6767a4bb14e9022494898f0f

const getMentorAvailableSlots = async (query: Record<string, unknown>) => {
  const { mentorId, duration, date }: any = query;

  // console.log('mentorId', mentorId, 'duration', duration, 'date', date);
  const registerMentor = await MentorRegistration.findOne({ mentorId });

  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }

  const bookings = await ScheduleBooking.find({
    mentorId,
    bookingDate: new Date(date),
  }).select('startTime  endTime');

  // console.log('startTime  ', registerMentor.startTime);
  // console.log('endTime  ', registerMentor.endTime);
  // console.log('startBreakTime  ', registerMentor.startBreakTime);
  // console.log('endBreakTime  ', registerMentor.endBreakTime);
  // console.log({ duration });
  // console.log({ bookings });
  // console.log('minimumSlotTime  ', 15);
  const durationNum = Number(duration);

  const availableSlots = generateAvailableSlots({
    startTime: registerMentor.startTime,
    endTime: registerMentor.endTime,
    startBreakTime: registerMentor.startBreakTime,
    endBreakTime: registerMentor.endBreakTime,
    bookings,
    duration: durationNum,
    minimumSlotTime: 15,
  });
  // console.log({availableSlots});

  return { result: availableSlots };
};

const getSingleMentorRegistrationQuery = async (id: string) => {
  const registerMentor = await MentorRegistration.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }
  const mentorRegistration = await MentorRegistration.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (mentorRegistration.length === 0) {
    throw new AppError(404, 'Mentor not found!!');
  }

  return mentorRegistration[0];
};

const getAdminMentorQuery = async (query: Record<string, unknown>) => {
  const mentorRegistrationQuery = new QueryBuilder(
    MentorRegistration.find({}).populate('mentorId'),
    query,
  )
    .search(['fullName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await mentorRegistrationQuery.modelQuery;
  const meta = await mentorRegistrationQuery.countTotal();
  return { meta, result };
};

const getMentorRegistrationOnly = async (id: string) => {
  const mentor = await User.findById(id).populate({
    path: 'mentorRegistrationId',
    populate: { path: 'mentorId' },
  });
  
  if (!mentor) {
    throw new AppError(404, 'Mentor is Not Found!!');
  }

  console.log('=========', mentor.mentorRegistrationId);

  if (!mentor.mentorRegistrationId) {
    throw new AppError(404, 'Mentor Registration is Not Found!!');
  }

  return mentor?.mentorRegistrationId;
};

const updateMentorRegistrationQuery = async (
  id: string,
  payload: Partial<any>,
) => {
  // Start a session for the transaction
  const session = await MentorRegistration.startSession();
  session.startTransaction();

  try {
    const registerMentor =
      await MentorRegistration.findById(id).session(session);
    if (!registerMentor) {
      throw new AppError(404, 'Register Mentor Not Found!!');
    }

    const mentorRegistration = await MentorRegistration.findByIdAndUpdate(
      id,
      payload,
      { new: true, session },
    );

    let image = null;
    if (payload?.image || payload.fullName) {
      const userData: any = {};

      if (payload.fullName) {
        userData.fullName = payload.fullName;
      }

      if (payload.image) {
        userData.image = payload.image;
      }

      let user;
      if (registerMentor.mentorId) {
        user = await User.findByIdAndUpdate(registerMentor.mentorId, userData, {
          new: true,
          session,
        });
        image = user?.image;
      } else {
      }
    }

    await session.commitTransaction();
    session.endSession();

    return { mentorRegistration, image };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error during mentor registration update:', error);
    throw error;
  }
};

const acceptSingleMentorRegistrationService = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const registerMentor =
      await MentorRegistration.findById(id).session(session);
    if (!registerMentor) {
      throw new AppError(404, 'Register Mentor Not Found!!');
    }

    const mentorShedulingPricingAdd = await MentorShediulPricing.find({}).session(session)
    if (mentorShedulingPricingAdd.length === 0) {
      throw new AppError(
        404,
        'Please set scheduling price for mentor before proceeding!',
      );
    }
      const mentor = await User.findById(registerMentor.mentorId).session(
        session,
      );
    if (!mentor) {
      throw new AppError(404, 'Mentor Not Found!!');
    }

    const mentorRegistration: any = await MentorRegistration.findByIdAndUpdate(
      id,
      { status: 'accept' },
      { new: true, session },
    );

    const updatedMentor = await User.findByIdAndUpdate(
      registerMentor.mentorId,
      { mentorRegistrationId: mentorRegistration._id },
      { new: true, session },
    );

    const addWallet = await walletService.addWalletService(mentor._id, session);

    if (!addWallet) {
      throw new AppError(404, 'Wallet Not Found!!');
    }

    await acceptanceRegistrationEmail({
      sentTo: mentorRegistration.email,
      subject: 'Mentor Registration Accepted!!',
      name: mentorRegistration.fullName,
    });

    await session.commitTransaction();
    session.endSession();

    return mentorRegistration;
  } catch (error) {
    console.error('Transaction Error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cencelSingleMentorRegistrationService = async (
  id: string,
  rejone: string,
) => {
  const registerMentor = await MentorRegistration.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }
  if (registerMentor.status === 'cenceled') {
    throw new AppError(404, 'Register Already is cenceled !!');
  }
  const mentorRegistration = await MentorRegistration.findByIdAndUpdate(
    id,
    { status: 'cenceled' },
    { new: true },
  );

  if (!mentorRegistration) {
    throw new AppError(404, 'Failed to cencel Mentor Registration!');
  }

  try {
    await cancellationRegistrationEmail({
      sentTo: mentorRegistration.email,
      subject: 'Mentor Registration Cancellation!!',
      name: mentorRegistration.fullName,
      rejone,
    });
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw new AppError(500, 'Failed to send cancellation email');
  }

  return mentorRegistration;
};

export const mentorRegistrationService = {
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
