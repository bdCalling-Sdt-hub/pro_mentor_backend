import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';

import settingsRouter from '../modules/settings/setting.route';
import mentorRegistrationRouter from '../modules/mentorRegistration/mentorRegistration.route';
import videoRouter from '../modules/video/video.route';
import reviewRouter from '../modules/review/review.route';
import walletRouter from '../modules/wallet/wallet.route';
import paymentRouter from '../modules/payment/payment.route';
import taskGoalRouter from '../modules/taskGoal/taskGoal.route';
import availableTimeRouter from '../modules/availableTime/availableTime.route';
import bookingRouter from '../modules/shediulBooking/shediulBooking.route';
import mentorBookingRouter from '../modules/mentorBooking/mentorBooking.route';
import withdrawRouter from '../modules/withdraw/withdraw.route';
import notificationRoutes from '../modules/notification/notification.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },

  {
    path: '/setting',
    route: settingsRouter,
  },
  {
    path: '/notification',
    route: notificationRoutes,
  },
  {
    path: '/mentorRegistration',
    route: mentorRegistrationRouter,
  },
  {
    path: '/video',
    route: videoRouter,
  },
  {
    path: '/review',
    route: reviewRouter,
  },
  {
    path: '/wallet',
    route: walletRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/withdraw',
    route: withdrawRouter,
  },
  {
    path: '/taskGoal',
    route: taskGoalRouter,
  },
  {
    path: '/shediulBooking',
    route: bookingRouter,
  },
  {
    path: '/availableTime',
    route: availableTimeRouter,
  },
  {
    path: '/mentorBooking',
    route: mentorBookingRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
