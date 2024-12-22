"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("./user.constants");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const otp_validation_1 = require("../otp/otp.validation");
const upload = (0, fileUpload_1.default)('./public/uploads/profile');
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes
    .post('/create', (0, validateRequest_1.default)(user_validation_1.userValidation === null || user_validation_1.userValidation === void 0 ? void 0 : user_validation_1.userValidation.userValidationSchema), user_controller_1.userController.createUser)
    .post('/create-user-verify-otp', (0, validateRequest_1.default)(otp_validation_1.resentOtpValidations.verifyOtpZodSchema), user_controller_1.userController.userCreateVarification)
    .get('/my-profile', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE, user_constants_1.USER_ROLE.MENTOR, user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUB_ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), user_controller_1.userController.getMyProfile)
    .get('/all-users', user_controller_1.userController.getAllUsers)
    .get('/delete-my-accountasdsadsdf', user_controller_1.userController.getMentor)
    .get('/all-users-count', user_controller_1.userController.getAllUserCount)
    .get('/all-mentors-count', user_controller_1.userController.getAllMentorCount)
    .get('/all-mentees-count', user_controller_1.userController.getAllMenteeCount)
    .get('/all-users-rasio', user_controller_1.userController.getAllUserRasio)
    .get('/:id', user_controller_1.userController.getUserById)
    .patch('/update-my-profile', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE, user_constants_1.USER_ROLE.MENTOR, user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUB_ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), upload.single('image'), (0, parseData_1.default)(), user_controller_1.userController.updateMyProfile)
    .put('/block/:id', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN, USER_ROLE.SUPER_ADMIN),
user_controller_1.userController.blockedUser)
    .delete('/delete-my-account', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE, user_constants_1.USER_ROLE.MENTOR, user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUB_ADMIN, user_constants_1.USER_ROLE.SUPER_ADMIN), user_controller_1.userController.deleteMyAccount);
// export default userRoutes;
