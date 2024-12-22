import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { paymentService } from './payment.service';
import sendResponse from '../../utils/sendResponse';

const addPayment = catchAsync(async (req, res, next) => {
const {userId} = req.user;
  const paymentData = req.body;
  paymentData.menteeId = userId;

  //  if (paymentData.method === 'bank') {
  //    paymentData.bankDetails = JSON.parse(paymentData.bankDetails);
  //  }
  //  if (paymentData.method === 'paypal') {
  //    paymentData.paypalDetails = JSON.parse(paymentData.paypalDetails);
  //  }
  //  if (paymentData.method === 'apple_pay') {
  //    paymentData.stripeDetails = JSON.parse(paymentData.applePayDetails);
  //  }
  
// console.log('req.body', req.body);


  const result = await paymentService.addPaymentService(req.body);

   if (result) {
     sendResponse(res, {
       statusCode: httpStatus.OK,
       success: true,
       message: 'Payment Successfull!!',
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



const getAllPayment = catchAsync(async (req, res, next) => {
  const result = await paymentService.getAllPaymentService(req.query);
  // console.log('result',result)

   if (result) {
     sendResponse(res, {
       statusCode: httpStatus.OK,
       success: true,
       message: 'Payment are retrived Successfull!!',
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

const getAllPaymentByMentor = catchAsync(async (req, res, next) => {
    const { userId } = req.user;
  const result = await paymentService.getAllPaymentByMentorService(
      req.query,
      userId
  );
  // console.log('result',result)
   if (result) {
     sendResponse(res, {
       statusCode: httpStatus.OK,
       success: true,
       message: "My Payment are retrived Successfull!",
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

const getSinglePayment = catchAsync(async (req, res, next) => {
  const result = await paymentService.singlePaymentService(req.params.id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Payment are retrived Successfull!',
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


const getAllPaymentAmountCount = catchAsync(async (req, res) => {
  const result = await paymentService.getAllEarningAmountService();


   if (!result) {
     return sendResponse(res, {
       success: true,
       statusCode: httpStatus.OK,
       message: 'No earnings found',
       data: 0, // If result is 0, send data as 0
     });
   }


    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All Earning Amount successful!!',
      data: result , // If result is 0, send 0, else send result
    });
});


const deleteSinglePayment = catchAsync(async (req, res, next) => {
  // give me validation data
  const result = await paymentService.deleteSinglePaymentService(req.params.id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Delete Payment Successfull!!!',
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

export const paymentController = {
  addPayment,
  getAllPayment,
  getSinglePayment,
  deleteSinglePayment,
  getAllPaymentByMentor,
  getAllPaymentAmountCount,
};
