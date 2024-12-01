import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { withdrawService } from './withdraw.service';

const addWithdraw = catchAsync(async (req, res, next) => {
  console.log('gas');
  const withdrawData = req.body;
  console.log('withdrawData', withdrawData);
  if(withdrawData.method === 'bank'){
    withdrawData.bankDetails = JSON.parse(withdrawData.bankDetails);
  }if(withdrawData.method === 'paypal'){
    withdrawData.paypalDetails = JSON.parse(withdrawData.paypalDetails);
  }if (withdrawData.method === 'apple_pay') {
    withdrawData.stripeDetails = JSON.parse(withdrawData.applePayDetails);
  }
 
  const { userId } = req.user;
  withdrawData.mentorId = userId;
  
  const result = await withdrawService.addWithdrawService(withdrawData);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdraw Successfull!!',
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

const getAllWithdraw = catchAsync(async (req, res, next) => {
  const result = await withdrawService.getAllWithdrawService(req.query);
  // console.log('result',result)

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdraw are retrived Successfull!!',
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

const getAllWithdrawByMentor = catchAsync(async (req, res, next) => {
  console.log('...........');
  const { userId } = req.user;
  console.log('userId', userId);
  const result = await withdrawService.getAllWithdrawByMentorService(
    req.query,
    userId,
  );
  // console.log('result',result)
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'My Withdraw are retrived Successfull!',
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

const getSingleWithdraw = catchAsync(async (req, res, next) => {
  const result = await withdrawService.singleWithdrawService(req.params.id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Withdraw are retrived Successfull!',
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

const getAllWithdrawRequestAccept = catchAsync(async (req, res, next) => {
  // give me validation data
  const result = await withdrawService.acceptSingleWithdrawService(
    req.params.id,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Conform Withdraw Successfull!!!',
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

const deleteSingleWithdraw = catchAsync(async (req, res, next) => {
  // give me validation data
  const result = await withdrawService.deleteSingleWithdrawService(
    req.params.id,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Delete Withdraw Successfull!!!',
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

export const withdrawController = {
  addWithdraw,
  getAllWithdraw,
  getSingleWithdraw,
  getAllWithdrawByMentor,
  getAllWithdrawRequestAccept,
  deleteSingleWithdraw,
};
