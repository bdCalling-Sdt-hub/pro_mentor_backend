import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { NotificationController } from './notification.controller';

const notificationRoutes = Router();

notificationRoutes.post(
  '/create-notification',
  //   auth(USER_ROLE.USER),
  //   validateRequest(paymnetValidation),
  NotificationController.createNotification,
);

notificationRoutes.get(
  '/',
  NotificationController.getAllNotificationByUser,
);
notificationRoutes.get(
  '/admin-all',
  auth(USER_ROLE.ADMIN),
  NotificationController.getAllNotificationByAdmin,
);
notificationRoutes.get(
  '/all',
  auth(USER_ROLE.MENTEE, USER_ROLE.MENTOR),
  NotificationController.getSingleUserNotification,
);
notificationRoutes.get('/:id', NotificationController.getSingleNotification);
notificationRoutes.delete(
  '/:id',
  auth(USER_ROLE.MENTEE, USER_ROLE.MENTOR),
  NotificationController.deletedNotification,
);
notificationRoutes.put(
  '/mark-read/:userId',
  NotificationController.markNotificationsAsRead,
);
notificationRoutes.delete(
  '/admin/:id',
  auth(USER_ROLE.ADMIN),
  NotificationController.deletedAdminNotification,
);

export default notificationRoutes;