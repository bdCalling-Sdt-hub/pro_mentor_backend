"use strict";
// import express, { NextFunction, Request, Response } from 'express';
// import auth from '../../middleware/auth';
// import { USER_ROLE } from '../user/user.constants';
// import validateRequest from '../../middleware/validateRequest';
// import { mentorRegistrationValidation } from './mentorRegistration.validation';
// import { mentorRegistrationController } from './mentorRegistration.controller';
// import fileUpload from '../../middleware/fileUpload';
// import multer from 'multer';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const mentorRegistration_controller_1 = require("./mentorRegistration.controller");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const multer_1 = __importDefault(require("multer"));
const mentorRegistrationRouter = express_1.default.Router();
const documentsUpload = (0, fileUpload_1.default)('./public/uploads/documents');
mentorRegistrationRouter
    .post('/', 
// auth(USER_ROLE.MENTOR),
documentsUpload.fields([
    { name: 'introVideo', maxCount: 1 },
    { name: 'professionalCredential', maxCount: 5 },
    { name: 'additionalDocument', maxCount: 5 },
]), mentorRegistration_controller_1.mentorRegistrationController.createMentorRegistration)
    .get('/', mentorRegistration_controller_1.mentorRegistrationController.getallMentorRegistration)
    .get('/available/:mentorId', mentorRegistration_controller_1.mentorRegistrationController.getMentorAvailableSlots)
    .get('/admin', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), mentorRegistration_controller_1.mentorRegistrationController.getAdminMentorRegistration)
    .get('/me', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), mentorRegistration_controller_1.mentorRegistrationController.getMentorRegistrationOnly)
    .get('/:id', mentorRegistration_controller_1.mentorRegistrationController.getSingleMentorRegistration)
    .patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR, user_constants_1.USER_ROLE.MENTEE), documentsUpload.fields([
    { name: 'introVideo', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), mentorRegistration_controller_1.mentorRegistrationController.updateSingleMentorRegistration)
    .patch('/accept/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), mentorRegistration_controller_1.mentorRegistrationController.acceptSingleMentorRegistration)
    .patch('/cencel/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), mentorRegistration_controller_1.mentorRegistrationController.cencelSingleMentorRegistration);
mentorRegistrationRouter.use((err, req, res, next) => {
    // Handle multer errors (file upload issues)
    if (err instanceof multer_1.default.MulterError) {
        // console.log(err);
        return res.status(400).json({ message: err.message });
    }
    // Handle custom validation errors or other errors
    return res
        .status(500)
        .json({ message: err.message || 'An error occurred' });
});
exports.default = mentorRegistrationRouter;
