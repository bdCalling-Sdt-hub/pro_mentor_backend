import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TTask, TTaskGoal } from './taskGoal.interface';
import TaskGoal from './taskGoal.model';


const createMentorTaskGoalService = async (payload: TTaskGoal) => {
  console.log('payuload', payload);

  const result = await TaskGoal.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Task Goal added!!');
  }

  return result;
};

const addTaskToTaskGoalService = async (payload: any) => {
  console.log('task add', payload);

  if (!payload.taskGoalId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Task Goal ID is required!');
  }

  const taskGoal:any = await TaskGoal.findById(payload.taskGoalId);
  if (!taskGoal) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task Goal Not Found!');
  }
  if (taskGoal.taskCount === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You have reached the maximum task limit!!',
    );
  }



  const task = {
    taskName: payload.taskName,
    taskfiles: Array.isArray(payload.taskfiles) ? payload.taskfiles : [],
    status: payload.status || 'pending',
  };

  const result = await TaskGoal.updateOne(
    { _id: payload.taskGoalId },
    {
      $push: { tasks: task },
      $inc: { taskCount: -1 }, 
    },
  );

  if (!result || result.modifiedCount === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to add task to Task Goal!',
    );
  }

  return task;
};






const getAllMentorGoalsService = async (
  query: Record<string, unknown>,
  mentorId: string,
) => {
console.log('query', query.menteeId);
  const taskGoalQuery = new QueryBuilder(
    TaskGoal.find({ mentorId, menteeId:query.menteeId }).populate('mentorId').populate('menteeId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await taskGoalQuery.modelQuery;

  const resultWithGoalProgress = result.map((taskGoal: any) => {
    const tasks = taskGoal.tasks || [];
    const completedTasks = tasks.filter(
      (task: any) => task.status === 'completed',
    ).length;
    const totalTasks = tasks.length;

    taskGoal.goalProgress =
      totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    return taskGoal;
  });

  const meta = await taskGoalQuery.countTotal();

  return { meta, result: resultWithGoalProgress };
};

const getAllMenteeGoalsService = async (
  query: Record<string, unknown>,
  menteeId: string,
) => {
  const taskGoalQuery = new QueryBuilder(
    TaskGoal.find({ menteeId, mentorId:query.mentorId }).populate('mentorId').populate('menteeId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await taskGoalQuery.modelQuery;

  const resultWithGoalProgress = result.map((taskGoal: any) => {
    const tasks = taskGoal.tasks || [];
    const completedTasks = tasks.filter(
      (task: any) => task.status === 'completed',
    ).length;
    const totalTasks = tasks.length;

    taskGoal.goalProgress =
      totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    return taskGoal;
  });

  const meta = await taskGoalQuery.countTotal();

  return { meta, result: resultWithGoalProgress };
};



const getSingleMentorTaskGoalQuery = async (id: string) => {
  const taskGoal = await TaskGoal.findById(id);
  if (!taskGoal) {
    throw new AppError(404, 'Task Goal Not Found!!');
  }
  const taskGoals = await TaskGoal.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (taskGoals.length === 0) {
    throw new AppError(404, 'Task Goal not found!');
  }

  return taskGoals[0];
};

const completedTaskStatus = async (taskGoalId: string, taskId: string) => {
  
  const taskGoal = await TaskGoal.findById(taskGoalId);
  if (!taskGoal) {
    throw new AppError(404, 'Task Goal Not Found!');
  }

  if (!taskGoal.tasks) {
    throw new AppError(404, 'No tasks found for this Task Goal!');
  }
  
  const taskIndex = taskGoal?.tasks?.findIndex(
    (task: TTask) => task._id.toString() === taskId,
  );
  if (taskIndex === -1) {
    throw new AppError(404, 'Task Not Found!');
  }

    taskGoal.tasks[taskIndex].status = 'completed';

  const updatedTaskGoal = await taskGoal.save(); 

  return updatedTaskGoal;
};


const taskGoalStatusService = async (taskGoalId: string) => {
  
  const taskGoal = await TaskGoal.findById(taskGoalId);
  if (!taskGoal) {
    throw new AppError(404, 'Task Goal Not Found!');
  }

  const validStatusTransitions: Record<string, string> = {
    running: 'checking', 
    checking: 'completed', 
  };

  const newStatus = validStatusTransitions[taskGoal.status];

  if (!newStatus) {
    throw new AppError(
      400,
      `Invalid status transition from ${taskGoal.status}`,
    );
  }

  const result = await TaskGoal.findByIdAndUpdate(
    taskGoalId,
    { status: newStatus },
    { new: true }, 
  );

  return result;
};

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


const updateMentorTaskGoal = async (id: string, payload: Partial<TTaskGoal>) => {
  const taskGoal = await TaskGoal.findById(id);
  if (!taskGoal) {
    throw new AppError(404, 'Task Goal Not Found!!');
  }
  const result = await TaskGoal.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deletedMentorTaskGoal = async (id: string) => {
  const taskGoal = await TaskGoal.findById(id);
  if (!taskGoal) {
    throw new AppError(404, 'Task Goal  Not Found!!');
  }
  const result = await TaskGoal.findOneAndDelete({ _id: id });

  return result;
};

export const mentorTaskGoalService = {
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
