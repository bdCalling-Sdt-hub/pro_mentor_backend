import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { mentorVideoController } from './video.controller';

const video = fileUpload('./public/uploads/video');

const videoRouter = express.Router();

videoRouter
  .post(
    '/',
    video.fields([
      { name: 'videoUrl', maxCount: 1 },
      { name: 'thumbnailUrl', maxCount: 1 },
    ]),
    auth(USER_ROLE.MENTOR),
    // validateRequest(videoValidation.VideoSchema),
    mentorVideoController.createMentorVideo,
  )
  .get(
    '/',
    auth(USER_ROLE.MENTOR),
    mentorVideoController.getMentorVideoByMentor,
  )
  .get(
    '/recommended',
    // auth(USER_ROLE.MENTOR),
    mentorVideoController.getMentorVideoByRecommended,
  )
  .get('/:id', mentorVideoController.getSingleMentorVideo)
  .patch(
    '/:id',
    video.fields([
      { name: 'videoUrl', maxCount: 1 },
      { name: 'thumbnailUrl', maxCount: 1 },
    ]),
    auth(USER_ROLE.MENTOR),
    mentorVideoController.updateSingleMentorVideo,
  )
  .patch('/views/:id', mentorVideoController.updateSingleMentorVideoViewUpdated)
  .delete(
    '/:id',
    auth(USER_ROLE.MENTOR),
    mentorVideoController.deleteSingleMentorVideo,
  );

export default videoRouter;
