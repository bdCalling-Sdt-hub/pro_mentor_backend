/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { DeleteAccountPayload, TUser, TUserCreate } from './user.interface';
import { User } from './user.models';
import { USER_ROLE } from './user.constants';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { otpServices } from '../otp/otp.service';
import { generateOptAndExpireTime } from '../otp/otp.utils';
import { TPurposeType } from '../otp/otp.interface';
import { otpSendEmail } from '../../utils/eamilNotifiacation';
import { createToken, verifyToken } from '../../utils/tokenManage';
import { ChecksumAlgorithm } from '@aws-sdk/client-s3';

export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface OTPVerifyAndCreateUserProps {
  otp: string;
  token: string;
}

const createUserToken = async (payload: TUserCreate) => {
  // console.log('payload service user')
  const { role, email, fullName, password, phone, about, professional } =
    payload;

  // user role check
  if (!(role === USER_ROLE.MENTEE || role === USER_ROLE.MENTOR)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User data is not valid !!');
  }

  // user exist check
  const userExist = await userService.getUserByEmail(email);

  if (userExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exist!!');
  }

  const { isExist, isExpireOtp } = await otpServices.checkOtpByEmail(email);

  const { otp, expiredAt } = generateOptAndExpireTime();

  let otpPurpose: TPurposeType = 'email-verification';

  if (isExist && !isExpireOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'otp-exist. Check your email.');
  } else if (isExist && isExpireOtp) {
    const otpUpdateData = {
      otp,
      expiredAt,
    };

    await otpServices.updateOtpByEmail(email, otpUpdateData);
  } else if (!isExist) {
    await otpServices.createOtp({
      name: fullName,
      sentTo: email,
      receiverType: 'email',
      purpose: otpPurpose,
      otp,
      expiredAt,
    });
  }

  const otpBody: TUserCreate = {
    email,
    fullName,
    password,
    phone,
    role,
  };

  if (about) {
    otpBody.about = about;
  }
  if (professional) {
    otpBody.professional = professional;
  }

  // send email
  // console.log('before otp send email');
  process.nextTick(async () => {
    await otpSendEmail({
      sentTo: email,
      subject: 'Your one time otp for email  verification',
      name: fullName,
      otp,
      expiredAt: expiredAt,
    });
  });
  // console.log('after otp send email');

  // crete token
  const createUserToken = createToken({
    payload: otpBody,
    access_secret: config.jwt_access_secret as string,
    expity_time: config.otp_token_expire_time as string | number,
  });

  return createUserToken;
};

const otpVerifyAndCreateUser = async ({
  otp,
  token,
}: OTPVerifyAndCreateUserProps) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token not found');
  }

  const decodeData = verifyToken({
    token,
    access_secret: config.jwt_access_secret as string,
  });

  if (!decodeData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not authorised');
  }

  const { password, email, fullName, role, phone, about, professional } =
    decodeData;

  const isOtpMatch = await otpServices.otpMatch(email, otp);

  if (!isOtpMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP did not match');
  }

  process.nextTick(async () => {
    await otpServices.updateOtpByEmail(email, {
      status: 'verified',
    });
  });

  if (!(role === USER_ROLE.MENTEE || role === USER_ROLE.MENTOR)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User data is not valid !!');
  }

  const userData = {
    password,
    email,
    fullName,
    role,
    phone,
    about,
    professional,
  };

  const isExist = await User.isUserExist(email as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  const user = await User.create(userData);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }


    const jwtPayload: {
      userId: string;
      role: string;
      fullName: string;
      email: string;
      phone: string;
    } = {
      fullName: user?.fullName,
      email: user.email,
      phone: user.phone,
      userId: user?._id?.toString() as string,
      role: user?.role,
    };

    // // console.log({ jwtPayload });
    // console.log('user user', user);

    const accessToken = createToken({
      payload: jwtPayload,
      access_secret: config.jwt_access_secret as string,
      expity_time: '60m',
    });

  return accessToken;
};

const updateUser = async (id: string, payload: Partial<TUser>) => {
  const { role, email, isActive, isDeleted,password, ...rest } = payload;

  // console.log('rest data',rest)

  const user = await User.findByIdAndUpdate(id, rest, { new: true });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User updating failed');
  }

  return user;
};

// ............................rest

const getAllUserQuery = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find({}), query)
    .search(['fullName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { meta, result };
};

const getAllUserCount = async () => {
  const allUserCount = await User.countDocuments();
  return allUserCount;
};
const getAllMentorCount = async () => {
  const allUserCount = await User.find({ role: USER_ROLE.MENTOR }).countDocuments();
  return allUserCount;
};
const getAllMenteeCount = async () => {
  const allUserCount = await User.find({ role: USER_ROLE.MENTEE }).countDocuments();
  return allUserCount;
};



const getAllUserRatio = async (year: number) => {
  const startOfYear = new Date(year, 0, 1); // January 1st of the given year
  const endOfYear = new Date(year + 1, 0, 1); // January 1st of the next year

  // Create an array with all 12 months to ensure each month appears in the result
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    mentorCount: 0, // Default mentor count
    menteeCount: 0, // Default mentee count
  }));

  // Aggregate mentor and mentee counts by month and role
  const userCounts = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lt: endOfYear },
        role: { $in: ['mentor', 'mentee'] }, // Filter for mentors and mentees
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' }, // Group by month
          role: '$role', // Group by role (mentor or mentee)
        },
        userCount: { $sum: 1 }, // Count users for each group
      },
    },
    {
      $project: {
        month: '$_id.month', // Extract month from the group
        role: '$_id.role', // Extract role from the group
        userCount: 1, // Include user count
        _id: 0, // Exclude _id from the result
      },
    },
    {
      $sort: { month: 1, role: 1 }, // Sort by month and role
    },
  ]);

  // Merge the result with months array
  userCounts.forEach((count) => {
    const monthData = months.find((m) => m.month === count.month);
    if (monthData) {
      if (count.role === 'mentor') {
        monthData.mentorCount = count.userCount; // Set mentor count
      } else if (count.role === 'mentee') {
        monthData.menteeCount = count.userCount; // Set mentee count
      }
    }
  });

  // Return the result
  return months;
};


const getUserById = async (id: string) => {
  const result = await User.findById(id).populate('mentorRegistrationId');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const getUserByEmail = async (email: string) => {
  const result = await User.findOne({ email });

  return result;
};

const deleteMyAccount = async (id: string, payload: DeleteAccountPayload) => {
  const user: TUser | null = await User.IsUserExistById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
  }

  const userDeleted = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!userDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return userDeleted;
};

const blockedUser = async (id: string) => {
  const singleUser = await User.IsUserExistById(id);

  if (!singleUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!singleUser.isActive) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Already Blocked');
  }
  // let status;

  // if (singleUser?.isActive) {
  //   status = false;
  // } else {
  //   status = true;
  // }
  let status = !singleUser.isActive; 
  // console.log('status', status);
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: status },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return user;
};

export const userService = {
  createUserToken,
  otpVerifyAndCreateUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteMyAccount,
  blockedUser,
  getAllUserQuery,
  getAllUserCount,
  getAllMentorCount,
  getAllMenteeCount,
  getAllUserRatio,
};
