"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskGoalController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const taskGoal_service_1 = require("./taskGoal.service");
const createMentorTaskGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    // Construct payload for service
    const bodyData = Object.assign(Object.assign({}, req.body), { mentorId: userId });
    console.log('bodyData', bodyData);
    const result = yield taskGoal_service_1.mentorTaskGoalService.createMentorTaskGoalService(bodyData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Goal added successfully!',
        data: result,
    });
}));
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
const addTaskToTaskGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    // console.log('files', files);
    // Extract task file paths
    const taskGoalFiles = (_a = files['taskfiles']) === null || _a === void 0 ? void 0 : _a.map((file) => file.path.replace(/^public[\\/]/, ''));
    // Construct payload for service
    const taskData = Object.assign(Object.assign({}, req.body), { taskfiles: taskGoalFiles, status: "pending" });
    console.log('taskData', taskData);
    const result = yield taskGoal_service_1.mentorTaskGoalService.addTaskToTaskGoalService(taskData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task added successfully!',
        data: result,
    });
}));
const getAllMentorGoals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield taskGoal_service_1.mentorTaskGoalService.getAllMentorGoalsService(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' Mentor Task Goal are requered successful!!',
    });
}));
const getAllMenteeGoals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield taskGoal_service_1.mentorTaskGoalService.getAllMenteeGoalsService(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: 'Mentee Task Goal are requered successful!!',
    });
}));
const getSingleMentorTaskGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield taskGoal_service_1.mentorTaskGoalService.getSingleMentorTaskGoalQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Task Goal are requered successful!!',
    });
}));
const completedTaskStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: taskGoalId } = req.params;
    const { taskId } = req.query;
    // Call the service to update the TaskGoal
    const result = yield taskGoal_service_1.mentorTaskGoalService.completedTaskStatus(taskGoalId, taskId);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Status updated successfully!',
        data: result,
    });
}));
const taskGoalStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: taskGoalId } = req.params;
    const result = yield taskGoal_service_1.mentorTaskGoalService.taskGoalStatusService(taskGoalId);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Goal status updated successfully!',
        data: result,
    });
}));
const updateSingleMentorTaskGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const files = req.files;
    if (!files || !files['taskfiles']) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'TaskGoal files are required');
    }
    // Extract task file paths
    const taskGoalFiles = files['taskfiles'].map((file) => file.path.replace(/^public[\\/]/, ''));
    // Construct payload for service
    const bodyData = Object.assign(Object.assign({}, req.body), { mentorId: userId, taskfiles: taskGoalFiles });
    // Call the service to update the TaskGoal
    const result = yield taskGoal_service_1.mentorTaskGoalService.updateMentorTaskGoal(id, bodyData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Task Goal updated successfully!',
        data: result,
    });
}));
const deleteSingleMentorTaskGoal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield taskGoal_service_1.mentorTaskGoalService.deletedMentorTaskGoal(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Task Goal are successful!!',
    });
}));
exports.taskGoalController = {
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
