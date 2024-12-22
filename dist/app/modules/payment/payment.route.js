"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
// import { auth } from "../../middlewares/auth.js";
const paymentRouter = express_1.default.Router();
paymentRouter
    .post('/add-payment', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTEE), payment_controller_1.paymentController.addPayment)
    .get('/all-earning-amount', payment_controller_1.paymentController.getAllPaymentAmountCount)
    .get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN), payment_controller_1.paymentController.getAllPayment)
    .get('/:id', payment_controller_1.paymentController.getSinglePayment)
    .get('/mentor', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), payment_controller_1.paymentController.getAllPaymentByMentor)
    .delete('/:id', payment_controller_1.paymentController.deleteSinglePayment);
exports.default = paymentRouter;
