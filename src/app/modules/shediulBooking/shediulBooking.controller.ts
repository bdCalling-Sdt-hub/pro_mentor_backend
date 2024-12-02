import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { mentorBookingService } from './shediulBooking.service';
import moment from 'moment';
import AppError from '../../error/AppError';
import ScheduleBooking from './shediulBooking.model';

const createMentorBooking = catchAsync(async (req, res) => {
  const bodyData = req.body;
  console.log('bodyData', bodyData);
  const { userId } = req.user;
  bodyData.menteeId = userId;
  console.log('bodyData.bookingTime', bodyData.bookingTime);
  const startTime = moment(bodyData.bookingTime, 'hh:mm A');
  const endTime = startTime.clone().add(bodyData.duration - 1, 'minutes');
  bodyData.startTime = startTime.format('hh:mm A');
  bodyData.endTime = endTime.format('hh:mm A');

  console.log({ startTime, endTime });

  const result =
    await mentorBookingService.createMentorBookingService(bodyData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking successfully!',
    data: result,
  });
});

const reSheduleMentorBooking = catchAsync(async (req, res) => {
  const bodyData = req.body;
  const id = req.params.id;
  const { userId } = req.user;
  bodyData.menteeId = userId;
  const startTime = moment(bodyData.bookingTime, 'hh:mm A');
  
  const existingBooking = await ScheduleBooking.findOne({ _id: id });
  if (!existingBooking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  bodyData.duration = existingBooking.duration;
  
  const endTime = startTime.clone().add(bodyData.duration - 1, 'minutes');
  bodyData.startTime = startTime.format('hh:mm A');
  bodyData.endTime = endTime.format('hh:mm A');

  const result =
    await mentorBookingService.reSheduleMentorBookingService(id, bodyData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking successfully!',
    data: result,
  });
});



const getBookingByMentor = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { menteeId }:any = req.query;
  const { meta, result } =
    await mentorBookingService.getAllMentorBookingByQuery(
      req.query,
      userId,
      menteeId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Booking By Mentor are requered successful!!',
  });
});

const getBookingByMentorAllBooking = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } =
    await mentorBookingService.getAllMentorByMenteeBookingByQuery(
      req.query,
      userId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Booking By Mentor are requered successful!!',
  });
});

const getBookingByMenteeAllBooking = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { meta, result } =
    await mentorBookingService.getAllMenteeByMentorBookingByQuery(
      req.query,
      userId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Booking By Mentor are requered successful!!',
  });
});

const getBookingByMentee = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { mentorId }:any = req.query;
  const { meta, result } =
    await mentorBookingService.getAllMenteeBookingByQuery(
      req.query,
      userId,
      mentorId,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Booking By Mentee are requered successful!!',
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
    message: 'Single Booking are requered successful!!',
  });
});

const updateSingleMentorBooking = catchAsync(async (req, res) => {
  const { id } = req.params; // Get video ID from the route
  const updateData = req.body;
  // Call the service to update the video
  const result = await mentorBookingService.updateMentorBookingQuery(
    id,
    updateData,
  );

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video updated successfully!',
    data: result,
  });
});

const deleteSingleMentorBooking = catchAsync(async (req, res) => {
  const result = await mentorBookingService.deletedMentorBookingQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Booking are successful!!',
  });
});

export const mentorBookingController = {
  createMentorBooking,
  getBookingByMentor,
  reSheduleMentorBooking,
  getBookingByMentorAllBooking,
  getBookingByMenteeAllBooking,
  getBookingByMentee,
  getSingleMentorBooking,
  updateSingleMentorBooking,
  deleteSingleMentorBooking,
};
