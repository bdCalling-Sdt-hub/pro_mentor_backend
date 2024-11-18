import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { availableTimeController } from './availableTime.controller';

const availableTimeRouter = express.Router();

availableTimeRouter
  .post(
    '/',
    auth(USER_ROLE.MENTOR),
    // validateRequest(videoValidation.VideoSchema),
    availableTimeController.createAvailableTime,
  )
  .get('/', auth(USER_ROLE.MENTOR), availableTimeController.getAvailableTimeByMentor);
//   .get('/:id', reviewController.getSingleReview)
//   .patch('/:id', auth(USER_ROLE.MENTEE), reviewController.updateSingleReview)
//   .delete('/:id', auth(USER_ROLE.MENTEE), reviewController.deleteSingleReview);

export default availableTimeRouter;
