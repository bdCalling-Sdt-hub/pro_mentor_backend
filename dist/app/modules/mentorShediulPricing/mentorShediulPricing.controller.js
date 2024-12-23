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
exports.mentorShediulPricingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mentorShediulPricing_service_1 = require("./mentorShediulPricing.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const getAllMentorShedulePricing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentorShediulPricing_service_1.mentorShediulPricingService.getMentorShediulPricingService();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Mentor Shediul Pricing are retrived Successfull!!',
        data: result,
    });
}));
const updateMentorShedulePricing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const id = req.params.id;
    if (!data.price) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Price is required");
    }
    data.price = Number(data.price);
    const result = yield mentorShediulPricing_service_1.mentorShediulPricingService.updateMentorShediulPricingService(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Mentor Shediul Pricing are Updated Successfull!!',
        data: result,
    });
}));
exports.mentorShediulPricingController = {
    getAllMentorShedulePricing,
    updateMentorShedulePricing,
};
