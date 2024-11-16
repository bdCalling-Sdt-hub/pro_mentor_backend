import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { mentorRegistrationValidation } from './mentorRegistration.validation';
import { mentorRegistrationController } from './mentorRegistration.controller';
import fileUpload from '../../middleware/fileUpload';
import multer from 'multer';

const video = fileUpload('./public/uploads/video');
const documents = fileUpload('./public/uploads/documents');


const mentorRegistrationRouter = express.Router();

mentorRegistrationRouter
  .post(
    '/',
    // video.fields([{ name: 'introVideo', maxCount: 1 }]),
    // documents.fields([
    //   { name: 'professionalCredential', maxCount: 5 },
    //   { name: 'additionalDocument', maxCount: 5 },
    // ]),
    // validateRequest(
    //   mentorRegistrationValidation.mentorRegistrationValidationSchema,
    // ),
    mentorRegistrationController.createMentorRegistration,
  )
  .get(
    '/',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    mentorRegistrationController.getMentorRegistration,
  )
  .get('/:id', mentorRegistrationController.getSingleMentorRegistration)
  .patch(
    '/:id',
    auth(USER_ROLE.MENTOR),
    mentorRegistrationController.updateSingleMentorRegistration,
  )
  .patch(
    '/accept/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    mentorRegistrationController.acceptSingleMentorRegistration,
  )
  .patch(
    '/cencel/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    mentorRegistrationController.cencelSingleMentorRegistration,
  );


export default mentorRegistrationRouter;
