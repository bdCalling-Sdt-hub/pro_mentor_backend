import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TReview } from './review.interface';
import { Review } from './review.model';


const createReviewService = async (payload: TReview) => {
  console.log('payuload', payload);

  const result = await Review.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Video added!!');
  }

  return result;
};

const getAllReviewByMentorQuery = async (
  query: Record<string, unknown>,
  mentorId: string,
) => {
  const videoQuery = new QueryBuilder(
    Review.find({ mentorId }).populate('mentorId'),
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

const getSingleReviewQuery = async (id: string) => {
  const video = await Review.findById(id);
  if (!video) {
    throw new AppError(404, 'Video Not Found!!');
  }
  const Review = await Review.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (Review.length === 0) {
    throw new AppError(404, 'Video not found!');
  }

  return Review[0];
};

const updateReviewQuery = async (id: string, payload: Partial<TReview>) => {
  const registerMentor = await Review.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Video Not Found!!');
  }
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deletedReviewQuery = async (id: string) => {
  const video = await Review.findById(id);
  if (!video) {
    throw new AppError(404, 'Video  Not Found!!');
  }
  const result = await Review.findOneAndDelete({ _id: id });

  return result;
};

export const reviewService = {
  createReviewService,
  getAllReviewByMentorQuery,
  getSingleReviewQuery,
  updateReviewQuery,
  deletedReviewQuery,
  //   getSettings,
};
