"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const video_controller_1 = require("./video.controller");
const video = (0, fileUpload_1.default)('./public/uploads/video');
const videoRouter = express_1.default.Router();
videoRouter
    .post('/', video.fields([
    { name: 'videoUrl', maxCount: 1 },
    { name: 'thumbnailUrl', maxCount: 1 },
]), (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), 
// validateRequest(videoValidation.VideoSchema),
video_controller_1.mentorVideoController.createMentorVideo)
    .get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), video_controller_1.mentorVideoController.getMentorVideoByMentor)
    .get('/recommended', 
// auth(USER_ROLE.MENTOR),
video_controller_1.mentorVideoController.getMentorVideoByRecommended)
    .get('/:id', video_controller_1.mentorVideoController.getSingleMentorVideo)
    .patch('/:id', video.fields([
    { name: 'videoUrl', maxCount: 1 },
    { name: 'thumbnailUrl', maxCount: 1 },
]), (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), video_controller_1.mentorVideoController.updateSingleMentorVideo)
    .patch('/views/:id', video_controller_1.mentorVideoController.updateSingleMentorVideoViewUpdated)
    .delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), video_controller_1.mentorVideoController.deleteSingleMentorVideo);
exports.default = videoRouter;
