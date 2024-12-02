// import express, { NextFunction, Request, Response } from 'express';
// import auth from '../../middleware/auth';
// import { USER_ROLE } from '../user/user.constants';
// import validateRequest from '../../middleware/validateRequest';
// import { mentorRegistrationValidation } from './mentorRegistration.validation';
// import { mentorRegistrationController } from './mentorRegistration.controller';
// import fileUpload from '../../middleware/fileUpload';
// import multer from 'multer';

// const video = fileUpload('./public/uploads/video');
// const documents = fileUpload('./public/uploads/documents');

// const mentorRegistrationRouter = express.Router();

// mentorRegistrationRouter
//   .post(
//     '/',
//     // video.fields([{ name: 'introVideo', maxCount: 1 }]),
//     documents.fields([
//       { name: 'introVideo', maxCount: 1 },
//       { name: 'professionalCredential', maxCount: 5 },
//       { name: 'additionalDocument', maxCount: 5 },
//     ]),
//     // validateRequest(
//     //   mentorRegistrationValidation.mentorRegistrationValidationSchema,
//     // ),
//     mentorRegistrationController.createMentorRegistration,
//   )

import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middleware/validateRequest';
import { mentorRegistrationController } from './mentorRegistration.controller';
import fileUpload from '../../middleware/fileUpload';
import multer from 'multer';

const mentorRegistrationRouter = express.Router();

const documentsUpload = fileUpload('./public/uploads/documents');

mentorRegistrationRouter
  .post(
    '/',
    // auth(USER_ROLE.MENTOR),
    documentsUpload.fields([
      { name: 'introVideo', maxCount: 1 },
      { name: 'professionalCredential', maxCount: 5 },
      { name: 'additionalDocument', maxCount: 5 },
    ]),
    mentorRegistrationController.createMentorRegistration,
  )

  .get('/', mentorRegistrationController.getallMentorRegistration)
  .get(
    '/available/:mentorId',
    mentorRegistrationController.getMentorAvailableSlots,
  )
  .get(
    '/admin',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    mentorRegistrationController.getAdminMentorRegistration,
  )
  .get(
    '/me',
    auth(USER_ROLE.MENTOR),
    mentorRegistrationController.getMentorRegistrationOnly,
  )
  .get('/:id', mentorRegistrationController.getSingleMentorRegistration)
  .patch(
    '/:id',
    auth(USER_ROLE.MENTOR),
    documentsUpload.fields([{ name: 'introVideo', maxCount: 1 }]),
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

mentorRegistrationRouter.use(
  (err: any, req: Request, res: Response, next: NextFunction): any => {
    // Handle multer errors (file upload issues)
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
    // Handle custom validation errors or other errors
    return res
      .status(500)
      .json({ message: err.message || 'An error occurred' });
  },
);

export default mentorRegistrationRouter;
