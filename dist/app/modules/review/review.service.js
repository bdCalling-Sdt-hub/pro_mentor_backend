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
exports.reviewService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const review_model_1 = require("./review.model");
const mentorRegistration_model_1 = require("../mentorRegistration/mentorRegistration.model");
const user_models_1 = require("../user/user.models");
const createReviewService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Payload:', payload);
        const result = yield review_model_1.Review.create(payload);
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add video review!');
        }
        const mentor = yield user_models_1.User.findById(payload.mentorId);
        if (!mentor) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Mentor not found!');
        }
        if (!mentor.mentorRegistrationId) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Mentor registration not found!');
        }
        const registration = yield mentorRegistration_model_1.MentorRegistration.findById(mentor.mentorRegistrationId);
        if (!registration) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Mentor registration not found!');
        }
        let { reviewCount, ratingCount } = registration;
        const newRating = (ratingCount * reviewCount + result.rating) / (reviewCount + 1);
        const updatedRegistration = yield mentorRegistration_model_1.MentorRegistration.findByIdAndUpdate(mentor.mentorRegistrationId, {
            reviewCount: reviewCount + 1,
            ratingCount: newRating,
        }, { new: true });
        if (!updatedRegistration) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update mentor registration!');
        }
        return result;
    }
    catch (error) {
        console.error('Error creating review:', error);
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An unexpected error occurred while creating the review.');
    }
});
const getAllReviewByMentorQuery = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new QueryBuilder_1.default(review_model_1.Review.find({ mentorId }).populate('mentorId').populate('menteeId'), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield reviewQuery.modelQuery;
    const meta = yield reviewQuery.countTotal();
    return { meta, result };
});
const getSingleReviewQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new AppError_1.default(404, 'Review Not Found!!');
    }
    const result = yield review_model_1.Review.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
    ]);
    if (result.length === 0) {
        throw new AppError_1.default(404, 'Review not found!');
    }
    return result[0];
});
const updateReviewQuery = (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !userId) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const result = yield review_model_1.Review.findOneAndUpdate({ _id: id, menteeId: userId }, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(404, 'Review Not Found or Unauthorized Access!');
    }
    return result;
});
const deletedReviewQuery = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !userId) {
        throw new AppError_1.default(400, 'Invalid input parameters');
    }
    const result = yield review_model_1.Review.findOneAndDelete({ _id: id, menteeId: userId });
    if (!result) {
        throw new AppError_1.default(404, 'Review Not Found!');
    }
    const mentor = yield user_models_1.User.findById(result.mentorId);
    if (!mentor) {
        throw new AppError_1.default(404, 'Mentor Not Found!');
    }
    if (!mentor.mentorRegistrationId) {
        throw new AppError_1.default(404, 'Mentor Registration Not Found!');
    }
    const registration = yield mentorRegistration_model_1.MentorRegistration.findById(mentor.mentorRegistrationId);
    if (!registration) {
        throw new AppError_1.default(404, 'Mentor Registration Not Found!');
    }
    const { reviewCount, ratingCount } = registration;
    console.log('reviewCount ratingCount', reviewCount, ratingCount);
    console.log('result.rating', result.rating);
    const newRatingCount = ratingCount - result.rating;
    console.log('newRatingCount', newRatingCount);
    const newReviewCount = reviewCount - 1;
    console.log('newReviewCount', newReviewCount);
    let newAverageRating = 0;
    console.log('newAverageRating', newAverageRating);
    if (newReviewCount > 0) {
        newAverageRating = newRatingCount / newReviewCount;
    }
    if (newReviewCount <= 0) {
        newAverageRating = 0;
    }
    console.log('newAverageRating-2', newAverageRating);
    const updatedRegistration = yield mentorRegistration_model_1.MentorRegistration.findByIdAndUpdate(mentor.mentorRegistrationId, {
        reviewCount: newReviewCount,
        ratingCount: newAverageRating,
    }, { new: true });
    if (!updatedRegistration) {
        throw new AppError_1.default(500, 'Failed to update mentor registration');
    }
    return result;
});
exports.reviewService = {
    createReviewService,
    getAllReviewByMentorQuery,
    getSingleReviewQuery,
    updateReviewQuery,
    deletedReviewQuery,
};
