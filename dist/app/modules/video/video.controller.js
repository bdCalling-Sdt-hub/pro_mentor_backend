"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorVideoController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const video_service_1 = require("./video.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createMentorVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const files = req.files;
    if (!files || !files['videoUrl'] || !files['thumbnailUrl']) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Both video and thumbnail files are required');
    }
    const videoFile1 = files['videoUrl'][0];
    const thumbnailFile1 = files['thumbnailUrl'][0];
    const videoPath = videoFile1.path.replace(/^public[\\/]/, '');
    const thumbnailPath = thumbnailFile1.path.replace(/^public[\\/]/, '');
    // Construct payload
    const bodyData = Object.assign(Object.assign({}, req.body), { mentorId: userId, videoUrl: videoPath, thumbnailUrl: thumbnailPath });
    // // console.log('bodyData', bodyData);
    const result = yield video_service_1.mentorVideoService.createMentorVideoService(bodyData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Video added successfully!',
        data: result,
    });
}));
const getMentorVideoByMentor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { meta, result } = yield video_service_1.mentorVideoService.getAllMentorVideoByIdQuery(req.query, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Video are requered successful!!',
    });
}));
const getMentorVideoByRecommended = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { related } = req.query;
    // // console.log('related', related);
    let recommended;
    if (related) {
        recommended = related;
    }
    const { meta, result } = yield video_service_1.mentorVideoService.getAllMentorVideoByRecommendedQuery(req.query, recommended);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All Recommended Video are requered successful!!',
    });
}));
const getSingleMentorVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield video_service_1.mentorVideoService.getSingleMentorVideoQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Video are requered successful!!',
    });
}));
const updateSingleMentorVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get video ID from the route
    // console.log('id', id);
    const files = req.files;
    // Initialize updateData with request body
    const updateData = Object.assign({}, req.body);
    // console.log('updateData111', updateData);
    // Check if new video or thumbnail files are provided
    if (files) {
        if (files['videoUrl'] && files['videoUrl'][0]) {
            const videoFile = files['videoUrl'][0];
            updateData.videoUrl = videoFile.path.replace(/^public[\\/]/, '');
        }
        if (files['thumbnailUrl'] && files['thumbnailUrl'][0]) {
            const thumbnailFile = files['thumbnailUrl'][0];
            updateData.thumbnailUrl = thumbnailFile.path.replace(/^public[\\/]/, '');
        }
    }
    // console.log('updateData222', updateData);
    // Call the service to update the video
    const result = yield video_service_1.mentorVideoService.updateMentorVideoQuery(id, updateData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Video updated successfully!',
        data: result,
    });
}));
const updateSingleMentorVideoViewUpdated = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield video_service_1.mentorVideoService.updateMentorVideoViewQuery(id);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Video view updated successfully!',
        data: result,
    });
}));
const deleteSingleMentorVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield video_service_1.mentorVideoService.deletedMentorVideoQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single Video are successful!!',
    });
}));
exports.mentorVideoController = {
    createMentorVideo,
    getMentorVideoByMentor,
    getMentorVideoByRecommended,
    getSingleMentorVideo,
    updateSingleMentorVideo,
    updateSingleMentorVideoViewUpdated,
    deleteSingleMentorVideo,
};
