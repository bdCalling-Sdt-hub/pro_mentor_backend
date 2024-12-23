import { Router } from 'express';
import { mentorShediulPricingController } from './mentorShediulPricing.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

export const shediulPricingRoutes = Router();


  shediulPricingRoutes
    .get(
      '/',
      auth(USER_ROLE.ADMIN),
      mentorShediulPricingController.getAllMentorShedulePricing,
    )
    .patch(
      '/:id',
      auth(USER_ROLE.ADMIN),
      mentorShediulPricingController.updateMentorShedulePricing,
    );

