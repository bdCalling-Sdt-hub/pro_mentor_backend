"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const availableTime_controller_1 = require("./availableTime.controller");
const availableTimeRouter = express_1.default.Router();
availableTimeRouter
    .post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), 
// validateRequest(videoValidation.VideoSchema),
availableTime_controller_1.availableTimeController.createAvailableTime)
    .get('/', availableTime_controller_1.availableTimeController.getAvailableTimeByMentor);
//   .get('/:id', reviewController.getSingleReview)
//   .patch('/:id', auth(USER_ROLE.MENTEE), reviewController.updateSingleReview)
//   .delete('/:id', auth(USER_ROLE.MENTEE), reviewController.deleteSingleReview);
exports.default = availableTimeRouter;
