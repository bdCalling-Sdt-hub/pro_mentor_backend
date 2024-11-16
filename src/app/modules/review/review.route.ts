import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { mentorVideoController } from './video.controller';


const reviewRouter = express.Router();

reviewRouter
  .post(
    '/',
    auth(USER_ROLE.MENTOR),
    // validateRequest(videoValidation.VideoSchema),
    mentorVideoController.createMentorVideo,
  )
  .get(
    '/',
    auth(USER_ROLE.MENTOR),
    mentorVideoController.getMentorVideoByMentor,
  )
  .get('/:id', mentorVideoController.getSingleMentorVideo)
  .patch(
    '/:id',
    auth(USER_ROLE.MENTOR),
    mentorVideoController.updateSingleMentorVideo,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.MENTOR),
    mentorVideoController.deleteSingleMentorVideo,
  );

export default reviewRouter;
