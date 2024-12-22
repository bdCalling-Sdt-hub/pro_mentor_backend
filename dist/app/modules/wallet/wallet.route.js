"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const wallet_controller_1 = require("./wallet.controller");
const walletRouter = express_1.default.Router();
walletRouter
    .post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), 
// validateRequest(videoValidation.VideoSchema),
wallet_controller_1.walletController.createWallet)
    .get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), wallet_controller_1.walletController.getSingleWalletByUser)
    .delete('/', (0, auth_1.default)(user_constants_1.USER_ROLE.MENTOR), wallet_controller_1.walletController.deleteWallet);
exports.default = walletRouter;
