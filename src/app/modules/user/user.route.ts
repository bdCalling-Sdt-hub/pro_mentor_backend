import { Router } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constants';
import parseData from '../../middleware/parseData';
import fileUpload from '../../middleware/fileUpload';
import { resentOtpValidations } from '../otp/otp.validation';
const upload = fileUpload('./public/uploads/profile');

export const userRoutes = Router(); 

userRoutes
  .post(
    '/create',
    validateRequest(userValidation?.userValidationSchema),
    userController.createUser,
  )
  .post(
    '/create-user-verify-otp',
    validateRequest(resentOtpValidations.verifyOtpZodSchema),
    userController.userCreateVarification,
  )
  .get(
    '/my-profile',
    auth(
      USER_ROLE.MENTEE,
      USER_ROLE.MENTOR,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    userController.getMyProfile,
  )
  .get('/all-users', userController.getAllUsers)
  .get('/all-users-count', userController.getAllUserCount)
  .get('/all-mentors-count', userController.getAllMentorCount)
  .get('/all-mentees-count', userController.getAllMenteeCount)
  .get('/all-users-rasio', userController.getAllUserRasio)
  .get('/:id', userController.getUserById)

  .patch(
    '/update-my-profile',
    auth(
      USER_ROLE.MENTEE,
      USER_ROLE.MENTOR,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    upload.single('image'),
    parseData(),
    userController.updateMyProfile,
  )
  .delete(
    '/delete-my-account',
    auth(
      USER_ROLE.MENTEE,
      USER_ROLE.MENTOR,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    userController.deleteMyAccount,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN, USER_ROLE.SUPER_ADMIN),
    userController.blockedUser,
  );

// export default userRoutes;
