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
exports.availableTimeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const availableTime_service_1 = require("./availableTime.service");
const createAvailableTime = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availableTimeData = req.body;
    //   const { userId } = req.user;
    //   AvailableTimeData.menteeId = userId;
    const result = yield availableTime_service_1.availableService.createAvailableService(availableTimeData);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'AvailableTime added successfully!',
        data: result,
    });
}));
const getAvailableTimeByMentor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, date } = req.query;
    const result = yield availableTime_service_1.availableService.getMentorAvailableTimeService(id, date);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: ' Available Time are  successful!!',
    });
}));
// const getSingleAvailableTime = catchAsync(async (req, res) => {
//   const result = await AvailableTimeService.getSingleAvailableTimeQuery(req.params.id);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Single AvailableTime are requered successful!!',
//   });
// });
// const updateSingleAvailableTime = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.user;
//   const updateData = req.body;
//   const result = await AvailableTimeService.updateAvailableTimeQuery(id, updateData, userId);
//   // Send response
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'AvailableTime updated successfully!',
//     data: result,
//   });
// });
// const deleteSingleAvailableTime = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const result = await AvailableTimeService.deletedAvailableTimeQuery(req.params.id, userId);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     data: result,
//     message: 'Deleted Single AvailableTime are successful!!',
//   });
// });
exports.availableTimeController = {
    createAvailableTime,
    getAvailableTimeByMentor,
    //   getSingleAvailableTime,
    //   updateSingleAvailableTime,
    //   deleteSingleAvailableTime,
};
