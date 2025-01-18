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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorVideoService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const video_model_1 = require("./video.model");
const user_models_1 = require("../user/user.models");
const video_utils_1 = require("./video.utils");
const createMentorVideoService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Payload:', payload);
    const { mentorId, title, description, category } = payload, rest = __rest(payload, ["mentorId", "title", "description", "category"]);
    if (!mentorId || !title || !description) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Missing required fields: mentorId, title, or description');
    }
    const mentor = yield user_models_1.User.findById(mentorId).populate('mentorRegistrationId');
    if (!mentor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Mentor Not Found!');
    }
    if (!mentor.mentorRegistrationId) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Mentor Registration Not Found!');
    }
    const { industryExpertise } = mentor.mentorRegistrationId;
    if (!industryExpertise) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Mentor registration missing industry expertise');
    }
    payload.category = industryExpertise;
    const result = yield video_model_1.Video.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add video');
    }
    return result;
});
const getAllMentorVideoByIdQuery = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    const videoQuery = new QueryBuilder_1.default(video_model_1.Video.find({ mentorId }).populate('mentorId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield videoQuery.modelQuery;
    const meta = yield videoQuery.countTotal();
    return { meta, result };
});
const getAllMentorVideoByRecommendedQuery = (query, related) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('related', related);
    const cleanedRelated = related === null || related === void 0 ? void 0 : related.trim();
    // console.log('cleanedRelated', cleanedRelated);
    if (cleanedRelated && typeof cleanedRelated !== 'string') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Related category must be a string');
    }
    let escapedRelated;
    if (cleanedRelated) {
        escapedRelated = (0, video_utils_1.escapeRegex)(cleanedRelated);
    }
    // console.log('escapedRelated', escapedRelated);
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const skip = (page - 1) * limit;
    let queryCondition = {};
    if (cleanedRelated) {
        // If `related` is provided, prioritize related videos first
        queryCondition = {
            $or: [
                { category: { $regex: escapedRelated, $options: 'i' } },
                { title: { $regex: escapedRelated, $options: 'i' } },
            ],
        };
    }
    else {
        // If `related` is not provided, fetch all videos
        queryCondition = {};
    }
    const result = yield video_model_1.Video.find(queryCondition)
        .skip(skip)
        .limit(limit)
        .populate('mentorId');
    // console.log('result', result);
    const total = yield video_model_1.Video.countDocuments(queryCondition);
    const totalPage = Math.ceil(total / limit);
    const meta = {
        limit,
        page,
        total,
        totalPage,
    };
    return { meta, result };
});
const getSingleMentorVideoQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield video_model_1.Video.findById(id);
    if (!video) {
        throw new AppError_1.default(404, 'Video Not Found!!');
    }
    const MentorVideo = yield video_model_1.Video.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (MentorVideo.length === 0) {
        throw new AppError_1.default(404, 'Video not found!');
    }
    return MentorVideo[0];
});
const updateMentorVideoQuery = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const registerMentor = yield video_model_1.Video.findById(id);
    if (!registerMentor) {
        throw new AppError_1.default(404, 'Video Not Found!!');
    }
    const result = yield video_model_1.Video.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const updateMentorVideoViewQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const registerMentor = yield video_model_1.Video.findById(id);
    if (!registerMentor) {
        throw new AppError_1.default(404, 'Video Not Found!!');
    }
    const result = yield video_model_1.Video.findByIdAndUpdate(id, { views: (registerMentor.views || 0) + 1 }, { new: true });
    return result;
});
const deletedMentorVideoQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield video_model_1.Video.findById(id);
    if (!video) {
        throw new AppError_1.default(404, 'Video  Not Found!!');
    }
    const result = yield video_model_1.Video.findOneAndDelete({ _id: id });
    return result;
});
exports.mentorVideoService = {
    createMentorVideoService,
    getAllMentorVideoByIdQuery,
    getAllMentorVideoByRecommendedQuery,
    getSingleMentorVideoQuery,
    updateMentorVideoQuery,
    updateMentorVideoViewQuery,
    deletedMentorVideoQuery,
};
