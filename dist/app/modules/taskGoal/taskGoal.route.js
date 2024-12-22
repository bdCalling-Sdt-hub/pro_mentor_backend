"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const taskGoal_controller_1 = require("./taskGoal.controller");
const taskFiles = (0, fileUpload_1.default)('./public/uploads/documents');
const taskGoalRouter = express_1.default.Router();
taskGoalRouter
    .post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), 
// validateRequest(videoValidation.VideoSchema),
taskGoal_controller_1.taskGoalController.createMentorTaskGoal)
    .post('/task', taskFiles.fields([{ name: 'taskfiles', maxCount: 5 }]), (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), 
// validateRequest(videoValidation.VideoSchema),
taskGoal_controller_1.taskGoalController.addTaskToTaskGoal)
    .get('/mentor', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), taskGoal_controller_1.taskGoalController.getAllMentorGoals)
    .get('/mentee', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), taskGoal_controller_1.taskGoalController.getAllMenteeGoals)
    .get('/:id', taskGoal_controller_1.taskGoalController.getSingleMentorTaskGoal)
    .patch('/:id', taskFiles.fields([{ name: 'taskfiles', maxCount: 5 }]), (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), taskGoal_controller_1.taskGoalController.updateSingleMentorTaskGoal)
    .patch('/task/:id', taskGoal_controller_1.taskGoalController.completedTaskStatus)
    .patch('/status/:id', taskGoal_controller_1.taskGoalController.taskGoalStatus)
    .delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), taskGoal_controller_1.taskGoalController.deleteSingleMentorTaskGoal);
exports.default = taskGoalRouter;
