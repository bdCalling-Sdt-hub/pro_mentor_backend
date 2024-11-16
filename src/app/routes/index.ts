import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';

import settingsRouter from '../modules/settings/setting.route';
import mentorRegistrationRouter from '../modules/mentorRegistration/mentorRegistration.route';
import videoRouter from '../modules/video/video.route';

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
    path: '/mentorRegistration',
    route: mentorRegistrationRouter,
  },
  {
    path: '/video',
    route: videoRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
