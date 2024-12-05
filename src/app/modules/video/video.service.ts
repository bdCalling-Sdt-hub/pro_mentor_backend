import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { Video } from './video.model';
import { TVideo } from './video.interface';
import { User } from '../user/user.models';
import { escapeRegex } from './video.utils';

const createMentorVideoService = async (payload: TVideo) => {
  
  console.log('Payload:', payload);

  
  const { mentorId, title, description, category, ...rest } = payload;

  
  if (!mentorId || !title || !description) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Missing required fields: mentorId, title, or description',
    );
  }

  
  const mentor = await User.findById(mentorId).populate('mentorRegistrationId');
  if (!mentor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Mentor Not Found!');
  }
  if (!mentor.mentorRegistrationId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Mentor Registration Not Found!');
  }

  
  const { industryExpertise }:any = mentor.mentorRegistrationId;
  if (!industryExpertise) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Mentor registration missing industry expertise',
    );
  }
  payload.category = industryExpertise;

  
  const result = await Video.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add video');
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

const getAllMentorVideoByRecommendedQuery = async (
  query: Record<string, unknown>,
  related: string,
) => {
  console.log('related', related);

  const cleanedRelated = related.trim();
  console.log('cleanedRelated', cleanedRelated);

  if (!cleanedRelated || typeof cleanedRelated !== 'string') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Related category is required and should be a string',
    );
  }

  const escapedRelated = escapeRegex(cleanedRelated);
  console.log('escapedRelated', escapedRelated);

  const limit = query.limit ? parseInt(query.limit as string, 10) : 10; 
  const page = query.page ? parseInt(query.page as string, 10) : 1; 

  const skip = (page - 1) * limit;

  const result = await Video.find({
    $or: [
      { category: { $regex: escapedRelated, $options: 'i' } },
      { title: { $regex: escapedRelated, $options: 'i' } },
    ],
  })
    .skip(skip) 
    .limit(limit) 
    .populate('mentorId'); 

  console.log('result', result);

  const total = await Video.countDocuments({
    $or: [
      { category: { $regex: escapedRelated, $options: 'i' } },
      { title: { $regex: escapedRelated, $options: 'i' } },
    ],
  });

  const totalPage = Math.ceil(total / limit);

  const meta = {
    limit,
    page,
    total,
    totalPage,
  };

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

const updateMentorVideoViewQuery = async (id: string) => {
  const registerMentor = await Video.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Video Not Found!!');
  }
  const result = await Video.findByIdAndUpdate(id,  { views: (registerMentor.views || 0) + 1 }, { new: true });

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
  getAllMentorVideoByRecommendedQuery,
  getSingleMentorVideoQuery,
  updateMentorVideoQuery,
  updateMentorVideoViewQuery,
  deletedMentorVideoQuery,
  
};
