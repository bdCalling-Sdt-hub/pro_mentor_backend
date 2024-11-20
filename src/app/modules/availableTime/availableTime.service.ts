import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { AvailableTime } from './availableTime.model';
import { TAvailableTime } from './availableTime.interface';
import { generateSlotsForDays } from './availableTime.utils';
import { MentorRegistration } from '../mentorRegistration/mentorRegistration.model';


const createAvailableService = async (payload: TAvailableTime) => {

  console.log('availableTime', payload);

//  const result = generateSlotsForDays(

//  );
//  console.log('result', result);

//   const result = await AvailableTime.create(payload);
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Available time added!!');
//   }

  return payload;
};


const getMentorAvailableTimeService = async (mentorId: string, date: string) => {
  console.log('mentorId', mentorId);
  console.log('date', date);

  const dayName = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
  });
  console.log('dayName', dayName);
  const verifyMentorDays = await MentorRegistration.findOne({
    mentorId,
    preferredDays: { $in: [dayName] }, // Correct the method to use $in for array matching
  });

  if (!verifyMentorDays) {
    throw new Error('The mentor is not available on this day');
  }

  console.log('verifyMentorDays', verifyMentorDays);
  const startTime = '09:00 AM';
  const endTime = '12:30 PM';
  // verifyMentorDays.startTime,
  // verifyMentorDays.endTime,
  const slots = generateSlotsForDays(startTime, endTime);

  console.log('slots', slots);

  return 'result';
};




// const getSingleAvailableQuery = async (id: string) => {
//   const available = await Available.findById(id);
//   if (!Available) {
//     throw new AppError(404, 'Available Not Found!!');
//   }
//   const result = await Available.aggregate([
//     { $match: { _id: new mongoose.Types.ObjectId(id) } },
//   ]);
//   if (result.length === 0) {
//     throw new AppError(404, 'Available not found!');
//   }

//   return result[0];
// };

// const updateAvailableQuery = async (
//   id: string,
//   payload: Partial<TAvailable>,
//   userId: string,
// ) => {
//   if (!id || !userId) {
//     throw new AppError(400, 'Invalid input parameters');
//   }

//   const result = await Available.findOneAndUpdate(
//     { _id: id, menteeId: userId },
//     payload,
//     { new: true, runValidators: true },
//   );

//   // If no matching Available is found, throw an error
//   if (!result) {
//     throw new AppError(404, 'Available Not Found or Unauthorized Access!');
//   }
//   return result;
// };

// const deletedAvailableQuery = async (id: string, userId: string) => {
//   if (!id || !userId) {
//     throw new AppError(400, 'Invalid input parameters');
//   }
//   const result = await Available.findOneAndDelete({ _id: id, menteeId: userId });

//   // If no matching Available is found, throw an error
//   if (!result) {
//     throw new AppError(404, 'Available Not Found!');
//   }

//   return result;
// };

export const availableService = {
  createAvailableService,
  getMentorAvailableTimeService,
  //   getSingleAvailableQuery,
  //   updateAvailableQuery,
  //   deletedAvailableQuery,
  //   getSettings,
};
