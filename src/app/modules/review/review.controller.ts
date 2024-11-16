import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ReviewService } from './Review.service';
import AppError from '../../error/AppError';

const createReview = catchAsync(async (req, res) => {

  const result = await ReviewService.createReviewService(req.body);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review added successfully!',
    data: result,
  });
});

const getReviewByMentor = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } = await ReviewService.getAllReviewByMentorQuery(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Review are requered successful!!',
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const result = await ReviewService.getSingleReviewQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Review are requered successful!!',
  });
});

const updateSingleReview = catchAsync(async (req, res) => {
  const { id } = req.params; 
  const updateData = req.body;
  const result = await ReviewService.updateReviewQuery(
    id,
    updateData,
  );

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully!',
    data: result,
  });
});

const deleteSingleReview = catchAsync(async (req, res) => {
  const result = await ReviewService.deletedReviewQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Review are successful!!',
  });
});

export const reviewController = {
  createReview,
  getReviewByMentor,
  getSingleReview,
  updateSingleReview,
  deleteSingleReview,
};
