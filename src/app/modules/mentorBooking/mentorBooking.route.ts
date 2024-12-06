import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { mentorBookingController } from './mentorBooking.controller';

const mentorBookingRouter = express.Router();

mentorBookingRouter
  .post(
    '/',

    auth(USER_ROLE.MENTEE),
    // validateRequest(videoValidation.VideoSchema),
    mentorBookingController.createMentorBooking,
  )
  .get(
    '/mentor/',
    auth(USER_ROLE.MENTOR),
    mentorBookingController.getMentorBookingByMentor,
  )
  .get(
    '/mentee/',
    auth(USER_ROLE.MENTEE),
    mentorBookingController.getMenteeBookingByMentor,
  )
  .get('/:id', mentorBookingController.getSingleMentorBooking)
  .patch(
    '/accept/:id',
    auth(USER_ROLE.MENTOR),
    mentorBookingController.acceptSingleMentorVideo,
  )
  .patch(
    '/cencel/:id',
    auth(USER_ROLE.MENTOR, USER_ROLE.MENTEE),
    mentorBookingController.cencelSingleMentorVideo,
  );

export default mentorBookingRouter;
