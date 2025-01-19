import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TReview } from './review.interface';
import { Review } from './review.model';
import { MentorRegistration } from '../mentorRegistration/mentorRegistration.model';
import { User } from '../user/user.models';


const createReviewService = async (payload: TReview) => {
  try {
    // console.log('Payload:', payload);

    const result = await Review.create(payload);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add video review!');
    }

    const mentor = await User.findById(payload.mentorId);
    if (!mentor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Mentor not found!');
    }

    if (!mentor.mentorRegistrationId) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Mentor registration not found!',
      );
    }

    const registration:any = await MentorRegistration.findById(
      mentor.mentorRegistrationId,
    );
    if (!registration) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Mentor registration not found!',
      );
    }
  
    let { reviewCount, ratingCount } = registration;
  
    const newRating =
      (ratingCount * reviewCount + result.rating) / (reviewCount + 1);

    const updatedRegistration = await MentorRegistration.findByIdAndUpdate(
      mentor.mentorRegistrationId,
      {
        reviewCount: reviewCount + 1,
        ratingCount: newRating,
      },
      { new: true },
    );

    if (!updatedRegistration) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update mentor registration!',
      );
    }

    return result;
  } catch (error) {
  
    console.error('Error creating review:', error);

    if (error instanceof AppError) {
      throw error;
    }

  
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred while creating the review.',
    );
  }
};


const getAllReviewByMentorQuery = async (
  query: Record<string, unknown>,
  mentorId: string,
) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ mentorId }).populate('mentorId').populate('menteeId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { meta, result };
};

const getSingleReviewQuery = async (id: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(404, 'Review Not Found!!');
  }
  const result = await Review.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (result.length === 0) {
    throw new AppError(404, 'Review not found!');
  }

  return result[0];
};

const updateReviewQuery = async (id: string, payload: Partial<TReview>, userId: string) => {
if (!id || !userId) {
  throw new AppError(400, 'Invalid input parameters');
}

const result = await Review.findOneAndUpdate(
  { _id: id, menteeId: userId }, 
  payload,
  { new: true, runValidators: true }, 
);

if (!result) {
  throw new AppError(404, 'Review Not Found or Unauthorized Access!');
}
  return result;
};

const deletedReviewQuery = async (id: string, userId: string) => {

  if (!id || !userId) {
    throw new AppError(400, 'Invalid input parameters');
  }

  const result = await Review.findOneAndDelete({ _id: id, menteeId: userId });

  if (!result) {
    throw new AppError(404, 'Review Not Found!');
  }

  const mentor = await User.findById(result.mentorId);
  if (!mentor) {
    throw new AppError(404, 'Mentor Not Found!');
  }

  if (!mentor.mentorRegistrationId) {
    throw new AppError(404, 'Mentor Registration Not Found!');
  }

  const registration:any = await MentorRegistration.findById(
    mentor.mentorRegistrationId,
  );
  if (!registration) {
    throw new AppError(404, 'Mentor Registration Not Found!');
  }


  const { reviewCount, ratingCount } = registration;
  // console.log('reviewCount ratingCount',reviewCount, ratingCount);
  // console.log('result.rating', result.rating);

  const newRatingCount = ratingCount - result.rating;
  // console.log('newRatingCount', newRatingCount);
  const newReviewCount = reviewCount - 1;
  // console.log('newReviewCount', newReviewCount);


  let newAverageRating = 0;
  // console.log('newAverageRating', newAverageRating);
  if (newReviewCount > 0) {
    newAverageRating = newRatingCount / newReviewCount;
  }


  if (newReviewCount <= 0) {
    newAverageRating = 0;
  }

  // console.log('newAverageRating-2', newAverageRating);

  const updatedRegistration = await MentorRegistration.findByIdAndUpdate(
    mentor.mentorRegistrationId,
    {
      reviewCount: newReviewCount,
      ratingCount: newAverageRating,
    },
    { new: true },
  );

  if (!updatedRegistration) {
    throw new AppError(500, 'Failed to update mentor registration');
  }


  return result;
};



export const reviewService = {
  createReviewService,
  getAllReviewByMentorQuery,
  getSingleReviewQuery,
  updateReviewQuery,
  deletedReviewQuery,

};
