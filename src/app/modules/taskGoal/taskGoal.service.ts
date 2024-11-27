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
  console.log('Payload:', payload);

  if (!payload.taskGoalId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Task Goal ID is required!');
  }

  const taskGoal = await TaskGoal.findById(payload.taskGoalId);
  if (!taskGoal) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task Goal Not Found!');
  }

  const task = {
    taskName: payload.taskName,
    taskfiles: payload.taskfiles || [],
    status: payload.status || 'pending'
  };

  const result = await TaskGoal.updateOne(
    { _id: payload.taskGoalId },
    { $push: { tasks: task } }, 
  );

  if (!result || result.modifiedCount === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to add task to Task Goal!',
    );
  }

  return task;
};


// const getAllBookingsShwduleByMentorTaskGoalQuery = async (
//   query: Record<string, unknown>,
//   id: string,
// ) => {
//   const taskGoalQuery = new QueryBuilder(
//     TaskGoal.find({ bookingScheduleId:id }).populate('mentorId'),
//     query,
//   )
//     .search([''])
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await taskGoalQuery.modelQuery;
//   const meta = await taskGoalQuery.countTotal();
//   return { meta, result };
// };
const getAllBookingsShwduleByMentorTaskGoalQuery = async (
  id: string,
) => {
  const result = TaskGoal.findOne({ bookingScheduleId: id }).populate('mentorId');

  return result;
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
  getAllBookingsShwduleByMentorTaskGoalQuery,
  getSingleMentorTaskGoalQuery,
  updateMentorTaskGoal,
  deletedMentorTaskGoal,
};
