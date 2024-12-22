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
exports.walletService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const wallet_model_1 = require("./wallet.model");
const addWalletService = (mentorId, session) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Input validation
    if (!mentorId) {
        throw new AppError_1.default(400, 'Mentor ID is required!');
    }
    if (!mongoose_1.Types.ObjectId.isValid(mentorId)) {
        throw new AppError_1.default(400, 'Invalid Mentor ID format!');
    }
    // Step 2: Find the mentor
    const mentor = yield user_models_1.User.findById(mentorId).session(session); // Use session here for transaction
    if (!mentor) {
        throw new AppError_1.default(404, 'Mentor not found!');
    }
    if (mentor.role !== 'mentor') {
        throw new AppError_1.default(400, 'The user is not a mentor!');
    }
    // Step 4: If the wallet doesn't exist, create a new wallet
    const payload = {
        mentorId: new mongoose_1.Types.ObjectId(mentorId), // Ensure the mentorId is of type ObjectId
        amount: 0, // Initialize the balance to 0
    };
    const wallet = yield wallet_model_1.Wallet.create([payload], { session }); // Use session here to ensure the creation is part of the transaction
    return wallet[0]; // Return the newly created wallet
});
const userWalletGetService = (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mentorId) {
        throw new AppError_1.default(400, 'Mentor ID is required!');
    }
    if (!mongoose_1.Types.ObjectId.isValid(mentorId)) {
        throw new AppError_1.default(400, 'Invalid Mentor ID format!');
    }
    const mentor = yield user_models_1.User.findById(mentorId);
    if (!mentor) {
        throw new AppError_1.default(404, 'Mentor not found!');
    }
    if (mentor.role !== 'mentor') {
        throw new AppError_1.default(400, 'The user is not a mentor!');
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ mentorId });
    return wallet;
});
const deletedWallet = (mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mentorId) {
        throw new AppError_1.default(400, 'Mentor ID is required!');
    }
    if (!mongoose_1.Types.ObjectId.isValid(mentorId)) {
        throw new AppError_1.default(400, 'Invalid Mentor ID format!');
    }
    const mentor = yield user_models_1.User.findById(mentorId);
    if (!mentor) {
        throw new AppError_1.default(404, 'Mentor not found!');
    }
    if (mentor.role !== 'mentor') {
        throw new AppError_1.default(400, 'The user is not a mentor!');
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ mentorId });
    if (!wallet) {
        throw new AppError_1.default(404, 'Wallet not found!');
    }
    const result = yield wallet_model_1.Wallet.findOneAndDelete({ mentorId });
    return result;
});
exports.walletService = {
    addWalletService,
    userWalletGetService,
    deletedWallet,
};
