import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';

import httpStatus from 'http-status';
import { User } from './user.models';

const createUser = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const createUserToken = await userService.createUserToken(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Check email for OTP',
    data: { createUserToken },
  });
});

const userCreateVarification = catchAsync(async (req, res) => {
  // console.log('..........1..........');
  const token = req.headers?.token as string;
  // console.log('token', token);
  const { otp } = req.body;
  // console.log('otp', otp);
  const newUser = await userService.otpVerifyAndCreateUser({ otp, token });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User create successfully',
    data: newUser,
  });
});

// rest >...............

const getMentor = catchAsync(async (req, res) => {
  // const as = await User.findById('674db0fb690c8d666f6c3a1c');

  const result = await User.findById('674db0fb690c8d666f6c3a1c').populate(
    'mentorRegistrationId',
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    // meta: result.meta,
    data: result,
    message: 'Users All are requered successful!!',
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUserQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Users All are requered successful!!',
  });
});

const getAllUserCount = catchAsync(async (req, res) => {
  const result = await userService.getAllUserCount();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Users All Count successful!!',
  });
});
const getAllMentorCount = catchAsync(async (req, res) => {
  const result = await userService.getAllMentorCount();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Mentors All Count successful!!',
  });
});
const getAllMenteeCount = catchAsync(async (req, res) => {
  const result = await userService.getAllMenteeCount();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Mentees All Count successful!!',
  });
});

const getAllUserRasio = catchAsync(async (req, res) => {
  const yearQuery = req.query.year;

  // Safely extract year as string
  const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;

  if (!year || isNaN(year)) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Invalid year provided!',
      data: {},
    });
  }

  const result = await userService.getAllUserRatio(year);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Users All Ratio successful!!',
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile fetched successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile('profile', req?.file?.filename);
  }
  // // console.log('file', req?.file);
  // // console.log('body data', req.body);
  
  

  const result = await userService.updateUser(req?.user?.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile updated successfully',
    data: result,
  });
});

const blockedUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.blockedUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Blocked successfully',
    data: result,
  });
});

const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.deleteMyAccount(req.user?.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  userCreateVarification,
  getUserById,
  getMyProfile,
  updateMyProfile,
  blockedUser,
  deleteMyAccount,
  getAllUsers,
  getAllUserCount,
  getAllMentorCount,
  getAllMenteeCount,
  getAllUserRasio,
  getMentor,
};
