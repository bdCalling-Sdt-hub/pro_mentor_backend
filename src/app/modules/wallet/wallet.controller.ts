import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { walletService } from './wallet.service';
import mongoose from 'mongoose';

const createWallet = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { userId } = req.user;
  const result = await walletService.addWalletService(userId, session);

  if (result) {
    await session.commitTransaction();
    session.endSession();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wallet added Successfull!!',
      data: result,
    });
  } else {
    await session.abortTransaction();
    session.endSession();
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Failed to add Wallet',
      data: {},
    });
  }
});

const getSingleWalletByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const result = await walletService.userWalletGetService(userId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wallet are retrive Successfull!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

const deleteWallet = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const result = await walletService.deletedWallet(userId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Deleted Wallet are Successfull!',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: true,
      message: 'Data is not found',
      data: {},
    });
  }
});

export const walletController = {
  createWallet,
  getSingleWalletByUser,
  deleteWallet,
};
