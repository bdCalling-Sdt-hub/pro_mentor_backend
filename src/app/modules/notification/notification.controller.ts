// import Stripe from "stripe";
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { notificationService } from './notification.service';
import httpStatus from 'http-status';
import app from '../../../app';
import AppError from '../../error/AppError';

const createNotification = catchAsync(async (req: Request, res: Response) => {
  // const result = await notificationService.createNotification(req.body);

  // sendResponse(res, {
  //   success: true,
  //   statusCode: httpStatus.OK,
  //   data: result,
  //   message: 'Notification successful',
  // });
});

const getAllNotificationByUser = catchAsync(async (req, res) => {

  const result = await notificationService.getAllNotificationQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Notification All are requered successful!!',
  });
});

const getSingleUserNotification = catchAsync(async (req, res) => {
  // const { userId } = req.params;
  const {userId} = req.user
  console.log('noti',{userId});
  const result = await notificationService.getUserNotification(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Notification All are requered successful!!',
  });
  
});


const getAllNotificationByAdmin = catchAsync(async (req, res) => {
  const result = await notificationService.getAllNotificationByAdminQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: 'Notification All are requered successful!!',
  });
});

const getSingleNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.getSingleNotification(
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Single notification get successful',
    });
  },
);




const deletedNotification = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await notificationService.deleteNotification(
    req.params.id,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'deleted successful',
  });
});

const deletedAdminNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.deleteAdminNotification(
      req.params.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'Notification deleted successful',
    });
  },
);

const markNotificationsAsRead = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await notificationService.markNotificationsAsRead(userId);
  if (!result) {
    throw new AppError(
      404,
      'No notifications found for this user or invalid user ID',
    ); 
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Notifications marked as read',
  });
  
});

export const NotificationController = {
  createNotification,
  getAllNotificationByUser,
  getSingleUserNotification,
  getAllNotificationByAdmin,
  getSingleNotification,
  deletedNotification,
  markNotificationsAsRead,
  deletedAdminNotification,
};
