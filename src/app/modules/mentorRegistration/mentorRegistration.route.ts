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
import { mentorRegistrationValidation } from './mentorRegistration.validation';
import { mentorRegistrationController } from './mentorRegistration.controller';
import fileUpload from '../../middleware/fileUpload';
import multer from 'multer';

// const video = fileUpload('./public/uploads/video');
// const documents = fileUpload('./public/uploads/documents');

const mentorRegistrationRouter = express.Router();

// Define separate upload handlers for video and documents
const documentsUpload = fileUpload('./public/uploads/documents'); // Document upload to the "documents" directory

mentorRegistrationRouter
  .post(
    '/',
    
    documentsUpload.fields([
      { name: 'introVideo', maxCount: 1 },
      { name: 'professionalCredential', maxCount: 5 }, // Up to 5 professional credentials
      { name: 'additionalDocument', maxCount: 5 }, // Up to 5 additional documents
    ]),
    auth(USER_ROLE.MENTOR),
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
