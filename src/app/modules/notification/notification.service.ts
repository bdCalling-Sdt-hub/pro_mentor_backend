import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import Notification from './notification.model';
import { TNotification } from './notification.interface';
import httpStatus from 'http-status';

const createNotification = async (payload: any, session: any) => {
  const result = await Notification.create([payload], { session });
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create notification',
    );
  }

  if (result) {
    io.emit('notification', result);
  }

  return result;
};

const getAllNotificationQuery = async (
  query: Record<string, unknown>,
) => {
  const notificationQuery = new QueryBuilder(Notification.find({  }), query) 
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();
  return { meta, result };
};



const getUserNotification = async (userId:string) => {
  console.log({userId});
  const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidUserId) {
    return null;
  }
  try {
    const notifications = await Notification.find({ userId });
    console.log({ notifications });

    if (notifications.length > 50) {
      const notificationsToDelete = notifications
        .sort((a:any, b:any) => a.createdAt - b.createdAt)
        .slice(0, notifications.length - 50);

      // Delete the excess notifications
      const deletePromises = notificationsToDelete.map((notification) =>
        Notification.findByIdAndDelete(notification._id),
      );
      await Promise.all(deletePromises);
    }

    console.log({ notifications });
    // Retrieve the remaining notifications in reverse order
    const remainingNotifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    return remainingNotifications;
  } catch (error) {
    console.error('Error while finding user notification:', error);
    throw error;
  }
};

const getAllNotificationByAdminQuery = async (
  query: Record<string, unknown>,
) => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ role: 'admin' }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();
  return { meta, result };
};

const markNotificationsAsRead = async (userId:any) => {
  const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidUserId) {
    return null;
  }
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true },
    );
    return result;
  } catch (error) {
    console.error('Error while marking notifications as read:', error);
    throw error;
  }
};

const getSingleNotification = async (id: string) => {
  const result = await Notification.findById(id);
  return result;
};

const deleteNotification = async (id: string, userId: string) => {
 
  // Fetch the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  const notification:any = await Notification.findById(id);
  if (!notification) {
    throw new AppError(404, 'Notification is not found!');
  }

  if (notification.userId.toString() !== userId) {
    throw new AppError(
      403,
      'You are not authorized to access this notification!',
    );
  }

  // Delete the SaveStory
  const result = await Notification.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

const deleteAdminNotification = async (id: string) => {
  const notification = await Notification.findById(id);
  if (!notification) {
    throw new AppError(404, 'Notification is not found!');
  }

  const result = await Notification.findOneAndDelete({
    _id: id,
    role: 'admin',
  });
  if (!result) {
    throw new AppError(500, 'Error deleting SaveStory!');
  }

  return result;
};

export const notificationService = {
  createNotification,
  getAllNotificationQuery,
  getUserNotification,
  markNotificationsAsRead,
  getAllNotificationByAdminQuery,
  deleteNotification,
  getSingleNotification,
  deleteAdminNotification,
};
