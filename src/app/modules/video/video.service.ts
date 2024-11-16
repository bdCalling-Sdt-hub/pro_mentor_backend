import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { Video } from './video.model';
import { TVideo } from './video.interface';

const createMentorVideoService = async (payload: TVideo) => {
  console.log('payuload', payload);
  
  const result = await Video.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Video added!!');
  }

  return result;
};

const getAllMentorVideoByIdQuery = async (query: Record<string, unknown>,mentorId:string) => {
  const videoQuery = new QueryBuilder(
    Video.find({ mentorId }).populate('mentorId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await videoQuery.modelQuery;
  const meta = await videoQuery.countTotal();
  return { meta, result };
};

const getSingleMentorVideoQuery = async (id: string) => {
  const video = await Video.findById(id);
  if (!video) {
    throw new AppError(404, 'Video Not Found!!');
  }
  const MentorVideo = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (MentorVideo.length === 0) {
    throw new AppError(404, 'Video not found!');
  }

  return MentorVideo[0];
};

const updateMentorVideoQuery = async (id: string, payload: Partial<TVideo>) => {
  const registerMentor = await Video.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Video Not Found!!');
  }
  const result = await Video.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deletedMentorVideoQuery = async (id: string) => {
  const video = await Video.findById(id);
  if (!video) {
    throw new AppError(404, 'Video  Not Found!!');
  }
  const result = await Video.findOneAndDelete({ _id: id });

  return result;
};

export const mentorVideoService = {
  createMentorVideoService,
  getAllMentorVideoByIdQuery,
  getSingleMentorVideoQuery,
  updateMentorVideoQuery,
  deletedMentorVideoQuery,
  //   getSettings,
};
