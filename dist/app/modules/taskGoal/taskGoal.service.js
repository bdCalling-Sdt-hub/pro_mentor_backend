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
exports.mentorTaskGoalService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const taskGoal_model_1 = __importDefault(require("./taskGoal.model"));
const createMentorTaskGoalService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('payuload', payload);
    const result = yield taskGoal_model_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to Task Goal added!!');
    }
    return result;
});
const addTaskToTaskGoalService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('task add', payload);
    if (!payload.taskGoalId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Task Goal ID is required!');
    }
    const taskGoal = yield taskGoal_model_1.default.findById(payload.taskGoalId);
    if (!taskGoal) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Task Goal Not Found!');
    }
    if (taskGoal.taskCount === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'You have reached the maximum task limit!!');
    }
    const task = {
        taskName: payload.taskName,
        taskfiles: Array.isArray(payload.taskfiles) ? payload.taskfiles : [],
        status: payload.status || 'pending',
    };
    const result = yield taskGoal_model_1.default.updateOne({ _id: payload.taskGoalId }, {
        $push: { tasks: task },
        $inc: { taskCount: -1 },
    });
    if (!result || result.modifiedCount === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add task to Task Goal!');
    }
    return task;
});
const getAllMentorGoalsService = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('query', query.menteeId);
    const taskGoalQuery = new QueryBuilder_1.default(taskGoal_model_1.default.find({ mentorId, menteeId: query.menteeId }).populate('mentorId').populate('menteeId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield taskGoalQuery.modelQuery;
    const resultWithGoalProgress = result.map((taskGoal) => {
        const tasks = taskGoal.tasks || [];
        const completedTasks = tasks.filter((task) => task.status === 'completed').length;
        const totalTasks = tasks.length;
        taskGoal.goalProgress =
            totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        return taskGoal;
    });
    const meta = yield taskGoalQuery.countTotal();
    return { meta, result: resultWithGoalProgress };
});
const getAllMenteeGoalsService = (query, menteeId) => __awaiter(void 0, void 0, void 0, function* () {
    const taskGoalQuery = new QueryBuilder_1.default(taskGoal_model_1.default.find({ menteeId, mentorId: query.mentorId }).populate('mentorId').populate('menteeId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield taskGoalQuery.modelQuery;
    const resultWithGoalProgress = result.map((taskGoal) => {
        const tasks = taskGoal.tasks || [];
        const completedTasks = tasks.filter((task) => task.status === 'completed').length;
        const totalTasks = tasks.length;
        taskGoal.goalProgress =
            totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        return taskGoal;
    });
    const meta = yield taskGoalQuery.countTotal();
    return { meta, result: resultWithGoalProgress };
});
const getSingleMentorTaskGoalQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const taskGoal = yield taskGoal_model_1.default.findById(id);
    if (!taskGoal) {
        throw new AppError_1.default(404, 'Task Goal Not Found!!');
    }
    const taskGoals = yield taskGoal_model_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (taskGoals.length === 0) {
        throw new AppError_1.default(404, 'Task Goal not found!');
    }
    return taskGoals[0];
});
const completedTaskStatus = (taskGoalId, taskId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const taskGoal = yield taskGoal_model_1.default.findById(taskGoalId);
    if (!taskGoal) {
        throw new AppError_1.default(404, 'Task Goal Not Found!');
    }
    if (!taskGoal.tasks) {
        throw new AppError_1.default(404, 'No tasks found for this Task Goal!');
    }
    const taskIndex = (_a = taskGoal === null || taskGoal === void 0 ? void 0 : taskGoal.tasks) === null || _a === void 0 ? void 0 : _a.findIndex((task) => task._id.toString() === taskId);
    if (taskIndex === -1) {
        throw new AppError_1.default(404, 'Task Not Found!');
    }
    taskGoal.tasks[taskIndex].status = 'completed';
    const updatedTaskGoal = yield taskGoal.save();
    return updatedTaskGoal;
});
const taskGoalStatusService = (taskGoalId) => __awaiter(void 0, void 0, void 0, function* () {
    const taskGoal = yield taskGoal_model_1.default.findById(taskGoalId);
    if (!taskGoal) {
        throw new AppError_1.default(404, 'Task Goal Not Found!');
    }
    const validStatusTransitions = {
        running: 'checking',
        checking: 'completed',
    };
    const newStatus = validStatusTransitions[taskGoal.status];
    if (!newStatus) {
        throw new AppError_1.default(400, `Invalid status transition from ${taskGoal.status}`);
    }
    const result = yield taskGoal_model_1.default.findByIdAndUpdate(taskGoalId, { status: newStatus }, { new: true });
    return result;
});
// const fullGoalTaskGoalStatusService = async (taskGoalId: string) => {
//   const taskGoal = await TaskGoal.findById(taskGoalId);
//   if (!taskGoal) {
//     throw new AppError(404, 'Task Goal Not Found!');
//   }
//   const result = await TaskGoal.findByIdAndUpdate(
//     taskGoalId,
//     { status: 'completed' },
//     { new: true },
//   );
//   return result;
// };
const updateMentorTaskGoal = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const taskGoal = yield taskGoal_model_1.default.findById(id);
    if (!taskGoal) {
        throw new AppError_1.default(404, 'Task Goal Not Found!!');
    }
    const result = yield taskGoal_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deletedMentorTaskGoal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const taskGoal = yield taskGoal_model_1.default.findById(id);
    if (!taskGoal) {
        throw new AppError_1.default(404, 'Task Goal  Not Found!!');
    }
    const result = yield taskGoal_model_1.default.findOneAndDelete({ _id: id });
    return result;
});
exports.mentorTaskGoalService = {
    createMentorTaskGoalService,
    addTaskToTaskGoalService,
    getAllMentorGoalsService,
    getAllMenteeGoalsService,
    getSingleMentorTaskGoalQuery,
    updateMentorTaskGoal,
    completedTaskStatus,
    taskGoalStatusService,
    deletedMentorTaskGoal,
};
