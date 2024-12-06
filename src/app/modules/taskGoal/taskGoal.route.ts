import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { taskGoalController } from './taskGoal.controller';

const taskFiles = fileUpload('./public/uploads/documents');

const taskGoalRouter = express.Router();

taskGoalRouter
  .post(
    '/',
    auth(USER_ROLE.MENTOR),
    // validateRequest(videoValidation.VideoSchema),
    taskGoalController.createMentorTaskGoal,
  )
  .post(
    '/task',
    taskFiles.fields([{ name: 'taskfiles', maxCount: 5 }]),
    auth(USER_ROLE.MENTOR),
    // validateRequest(videoValidation.VideoSchema),
    taskGoalController.addTaskToTaskGoal,
  )
  .get('/mentor', auth(USER_ROLE.MENTOR), taskGoalController.getAllMentorGoals)
  .get('/mentee', auth(USER_ROLE.MENTEE), taskGoalController.getAllMenteeGoals)
  .get('/:id', taskGoalController.getSingleMentorTaskGoal)
  .patch(
    '/:id',
    taskFiles.fields([{ name: 'taskfiles', maxCount: 5 }]),
    auth(USER_ROLE.MENTOR),
    taskGoalController.updateSingleMentorTaskGoal,
  )
  .patch('/task/:id', taskGoalController.completedTaskStatus)
  .patch('/status/:id', taskGoalController.taskGoalStatus)

  .delete(
    '/:id',
    auth(USER_ROLE.MENTOR),
    taskGoalController.deleteSingleMentorTaskGoal,
  );

export default taskGoalRouter;
