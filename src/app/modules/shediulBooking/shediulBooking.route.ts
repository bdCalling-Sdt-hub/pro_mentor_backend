import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { mentorBookingController } from './shediulBooking.controller';


const bookingRouter = express.Router();

bookingRouter
  .post(
    '/',

    auth(USER_ROLE.MENTEE),
    // validateRequest(videoValidation.VideoSchema),
    mentorBookingController.createMentorBooking,
  )
  .get(
    '/mentor/',
    auth(USER_ROLE.MENTOR),
    mentorBookingController.getBookingByMentor,
  )
  .get(
    '/mentor/all-booking',
    auth(USER_ROLE.MENTOR),
    mentorBookingController.getBookingByMentorAllBooking,
  )
  .get(
    '/mentee/',
    auth(USER_ROLE.MENTEE),
    mentorBookingController.getBookingByMentee,
  )
  .get(
    '/mentee/all-booking',
    auth(USER_ROLE.MENTEE),
    mentorBookingController.getBookingByMenteeAllBooking,
  )
  .get('/:id', mentorBookingController.getSingleMentorBooking)
  .patch(
    '/:id',

    auth(USER_ROLE.MENTOR),
    mentorBookingController.updateSingleMentorBooking,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.MENTOR, USER_ROLE.MENTEE),
    mentorBookingController.deleteSingleMentorBooking,
  );

export default bookingRouter;
