import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { authServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';

import config from '../../config';
import { otpServices } from '../otp/otp.service';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from '../user/user.models';

// login
const login = catchAsync(async (req: Request, res: Response) => {
  // console.log('login-1')
  const result = await authServices.login(req.body);
  // console.log(result)
  let newResult;
  if(result){
  const user:any =  await User.findOne({email: result.user.email});
  console.log('======',{ user });


  if(user.role === 'mentor'){
    newResult = { ...result, mentorRegistrationId : user.mentorRegistrationId ? user.mentorRegistrationId : null };
  }else{
    newResult = result;
  }

  }
  // console.log('login-2');
  const cookieOptions: any = {
    secure: false,
    httpOnly: true,
    maxAge: 31536000000,
  };

  if (config.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
  }

  console.log({newResult});

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: newResult,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req?.user;
  const { newPassword, oldPassword } = req.body;
  // // console.log({ newPassword, oldPassword });

  const result = await authServices.changePassword({
    userId,
    newPassword,
    oldPassword,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  // // console.log("email");
  // // console.log(req?.body?.email);
  const { email } = req.body;
  const result = await authServices.forgotPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'An OTP sent to your email!',
    data: result,
  });
});

// forgot password
const forgotPasswordOtpMatch = catchAsync(
  async (req: Request, res: Response) => {
    const token = req?.headers?.token as string;

    const { otp } = req.body;

    const result = await authServices.forgotPasswordOtpMatch({ otp, token });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Otp match successfully',
      data: result,
    });
  },
);

// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req?.headers?.token as string;

  const { newPassword, confirmPassword } = req.body;

  // console.log(newPassword, confirmPassword);

  const result = await authServices.resetPassword({
    token,
    newPassword,
    confirmPassword,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

// refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.headers?.refreshToken as string;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully',
    data: result,
  });
});

export const authControllers = {
  login,
  changePassword,
  forgotPassword,
  forgotPasswordOtpMatch,
  resetPassword,
  refreshToken,
};
