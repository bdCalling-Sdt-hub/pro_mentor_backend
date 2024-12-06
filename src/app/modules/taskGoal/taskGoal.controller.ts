import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { mentorTaskGoalService } from './taskGoal.service';

const createMentorTaskGoal = catchAsync(async (req, res) => {
  const { userId } = req.user;
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




// const createMentorTaskGoal = catchAsync(async (req, res) => {
//   // Body data
//   const { goalName, goalTasks } = req.body;

//   // Handle the uploaded files (multer adds files to `req.files`)
//   const tasks = goalTasks.map((task:any, index:any) => ({
//     taskName: task.taskName,
//     taskFile: req.files && req.files[index] ? req.files[index].path : null, // Attach the file path
//     status: task.status,
//   }));

//   // Create the full goal object to pass to the service
//   const bodyData = {
//     goalName,
//     goalTasks: tasks,
//   };

//   // Call service to save the goal
//   const result =
//     await mentorTaskGoalService.createMentorTaskGoalService(bodyData);

//   // Send response
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Task Goal added successfully!',
//     data: result,
//   });
// });




const addTaskToTaskGoal = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // console.log('files', files);

 
  // Extract task file paths
  const taskGoalFiles = files['taskfiles']?.map((file) =>
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


const getAllMentorGoals = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } = await mentorTaskGoalService.getAllMentorGoalsService(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' Mentor Task Goal are requered successful!!',
  });
});

const getAllMenteeGoals = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } = await mentorTaskGoalService.getAllMenteeGoalsService(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'Mentee Task Goal are requered successful!!',
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

const completedTaskStatus = catchAsync(async (req, res) => {
  const { id:taskGoalId }:any = req.params;
  const { taskId }:any = req.query;
  // Call the service to update the TaskGoal
  const result = await mentorTaskGoalService.completedTaskStatus(
    taskGoalId,
    taskId,
  );

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Status updated successfully!',
    data: result,
  });
});

const taskGoalStatus = catchAsync(async (req, res) => {
  const { id: taskGoalId }: any = req.params;

  const result = await mentorTaskGoalService.taskGoalStatusService(taskGoalId);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Goal status updated successfully!',
    data: result,
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
  getAllMentorGoals,
  getAllMenteeGoals,
  getSingleMentorTaskGoal,
  updateSingleMentorTaskGoal,
  completedTaskStatus,
  taskGoalStatus,
  deleteSingleMentorTaskGoal,
};   
