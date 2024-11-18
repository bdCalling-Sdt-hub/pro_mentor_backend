import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { availableService } from './availableTime.service';


const createAvailableTime = catchAsync(async (req, res) => {
  const availableTimeData = req.body;
//   const { userId } = req.user;
//   AvailableTimeData.menteeId = userId;

  const result =
    await availableService.createAvailableService(availableTimeData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AvailableTime added successfully!',
    data: result,
  });
});

const getAvailableTimeByMentor = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const  result= await availableService.getMentorAvailableTimeService(
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: ' AvailableTime are requered successful!!',
  });
});

// const getSingleAvailableTime = catchAsync(async (req, res) => {
//   const result = await AvailableTimeService.getSingleAvailableTimeQuery(req.params.id);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Single AvailableTime are requered successful!!',
//   });
// });

// const updateSingleAvailableTime = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.user;
//   const updateData = req.body;
//   const result = await AvailableTimeService.updateAvailableTimeQuery(id, updateData, userId);

//   // Send response
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'AvailableTime updated successfully!',
//     data: result,
//   });
// });

// const deleteSingleAvailableTime = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const result = await AvailableTimeService.deletedAvailableTimeQuery(req.params.id, userId);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Deleted Single AvailableTime are successful!!',
//   });
// });

export const availableTimeController = {
  createAvailableTime,
  getAvailableTimeByMentor,
//   getSingleAvailableTime,
//   updateSingleAvailableTime,
//   deleteSingleAvailableTime,
};
