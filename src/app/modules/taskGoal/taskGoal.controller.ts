import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { mentorTaskGoalService } from './taskGoal.service';

const createMentorTaskGoal = catchAsync(async (req, res) => {
  const { userId } = req.user;
  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//  if (!files || !files['taskfiles']) {
//    throw new AppError(httpStatus.BAD_REQUEST, 'TaskGoal files are required');
//  }

// //  // Extract task file paths
// //  const taskGoalFiles = files['taskfiles'].map((file) =>
// //    file.path.replace(/^public[\\/]/, ''),
// //  );

 // Construct payload for service
 const bodyData = {
   ...req.body,
   mentorId: userId, // Attach the mentorId to the task
  //  taskfiles: taskGoalFiles, // Add the file paths
 };

 console.log('bodyData', bodyData);

  const result =
    await mentorTaskGoalService.createMentorTaskGoalService(bodyData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Goal added successfully!',
    data: result,
  });
});

const addTaskToTaskGoal = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || !files['taskfiles']) {
    throw new AppError(httpStatus.BAD_REQUEST, 'TaskGoal files are required');
  }

  // Extract task file paths
  const taskGoalFiles = files['taskfiles'].map((file) =>
    file.path.replace(/^public[\\/]/, ''),
  );

  // Construct payload for service
  const taskData = {
    ...req.body,
    taskfiles: taskGoalFiles,
    status:"pending",
  };
  console.log('taskData', taskData);

  const result = await mentorTaskGoalService.addTaskToTaskGoalService(taskData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task added successfully!',
    data: result,
  });
});


const getBookingScheduleIdTaskGoal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await mentorTaskGoalService.getAllBookingsShwduleByMentorTaskGoalQuery(
      id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: ' All Booking By Task Goal are requered successful!!',
  });
});

const getSingleMentorTaskGoal = catchAsync(async (req, res) => {
  const result = await mentorTaskGoalService.getSingleMentorTaskGoalQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Task Goal are requered successful!!',
  });
});

const updateSingleMentorTaskGoal = catchAsync(async (req, res) => {
 const { userId } = req.user;
 const {id} = req.params;
 const files = req.files as { [fieldname: string]: Express.Multer.File[] };

 if (!files || !files['taskfiles']) {
   throw new AppError(httpStatus.BAD_REQUEST, 'TaskGoal files are required');
 }

 // Extract task file paths
 const taskGoalFiles = files['taskfiles'].map((file) =>
   file.path.replace(/^public[\\/]/, ''),
 );

 // Construct payload for service
 const bodyData = {
   ...req.body,
   mentorId: userId, 
   taskfiles: taskGoalFiles, 
 };
  // Call the service to update the TaskGoal
  const result = await mentorTaskGoalService.updateMentorTaskGoal(id, bodyData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Goal updated successfully!',
    data: result,
  });
});

const deleteSingleMentorTaskGoal = catchAsync(async (req, res) => {
  const result = await mentorTaskGoalService.deletedMentorTaskGoal(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Task Goal are successful!!',
  });
});

export const taskGoalController = {
  createMentorTaskGoal,
  addTaskToTaskGoal,
  getBookingScheduleIdTaskGoal,
  getSingleMentorTaskGoal,
  updateSingleMentorTaskGoal,
  deleteSingleMentorTaskGoal,
};   
