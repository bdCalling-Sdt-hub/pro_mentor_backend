import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { mentorBookingService } from './mentorBooking.service';

const createMentorBooking = catchAsync(async (req, res) => {
    const bodyData = req.body;
  const { userId } = req.user;
  bodyData.menteeId = userId;
  
  const result =
    await mentorBookingService.createMentorBookingService(bodyData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor Booking added successfully!',
    data: result,
  });
});

const getMentorBookingByMentor = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } =
    await mentorBookingService.getAllMentorBookingByIdQuery(req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Mentor Booking are requered successful!!',
  });
});

const getMenteeBookingByMentor = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } =
    await mentorBookingService.getAllMenteeBookingByQuery(req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Mentor Booking are requered successful!!',
  });
});

const getSingleMentorBooking = catchAsync(async (req, res) => {
  const result = await mentorBookingService.getSingleMentorBookingQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Mentor Booking are requered successful!!',
  });
});


const acceptSingleMentorVideo = catchAsync(async (req, res) => {
  const result = await mentorBookingService.acceptMentorBookingQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Accept Mentor Booking are successful!!',
  });
});

const cencelSingleMentorVideo = catchAsync(async (req, res) => {
  const result = await mentorBookingService.cencelMentorBookingQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Cencel Mentor Booking are successful!!',
  });
});

export const mentorBookingController = {
  createMentorBooking,
  getMentorBookingByMentor,
  getMenteeBookingByMentor,
  getSingleMentorBooking,
  acceptSingleMentorVideo,
  cencelSingleMentorVideo,
};
