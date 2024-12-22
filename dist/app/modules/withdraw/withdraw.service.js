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
exports.withdrawService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const withdraw_model_1 = require("./withdraw.model");
const wallet_model_1 = require("../wallet/wallet.model");
const addWithdrawService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId, amount, method, bankDetails, paypalPayDetails, applePayDetails, } = payload;
    const mentor = yield user_models_1.User.findById(mentorId);
    if (!mentor) {
        throw new AppError_1.default(400, 'Mentor is not found!');
    }
    if (mentor.role !== 'mentor') {
        throw new AppError_1.default(400, 'User is not authorized as a Mentor!!');
    }
    // Validate Withdrawal Amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(400, 'Invalid Withdrawal amount. It must be a positive number.');
    }
    const mentorWallet = yield wallet_model_1.Wallet.findOne({ mentorId });
    if (!mentorWallet) {
        throw new AppError_1.default(400, 'Mentor wallet is not found!');
    }
    if (amount > mentorWallet.amount) {
        throw new AppError_1.default(400, 'Insufficient funds in the wallet.');
    }
    // Validate Withdrawal Method
    const validMethods = ['bank', 'paypal_pay', 'apple_pay'];
    if (!method || !validMethods.includes(method)) {
        throw new AppError_1.default(400, 'Invalid Withdrawal method.');
    }
    // Method-specific validation
    if (method === 'bank') {
        if (!bankDetails ||
            !bankDetails.accountNumber ||
            !bankDetails.accountName ||
            !bankDetails.bankName) {
            throw new AppError_1.default(400, 'All bank details (account number, account name, bank name) are required for bank Withdrawals.');
        }
    }
    else if (method === 'paypal_pay') {
        if (!paypalPayDetails || !paypalPayDetails.paypalId) {
            throw new AppError_1.default(400, 'Google Pay token is required for Google Pay Withdrawals.');
        }
    }
    else if (method === 'apple_pay') {
        if (!applePayDetails || !applePayDetails.appleId) {
            throw new AppError_1.default(400, 'Apple Pay token is required for Apple Pay Withdrawals.');
        }
    }
    console.log('payload payload', payload);
    const result = yield withdraw_model_1.Withdraw.create(payload);
    return result;
});
const getAllWithdrawService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const WithdrawQuery = new QueryBuilder_1.default(withdraw_model_1.Withdraw.find()
        .populate('mentorId'), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield WithdrawQuery.modelQuery;
    const meta = yield WithdrawQuery.countTotal();
    return { meta, result };
});
const getAllWithdrawByMentorService = (query, mentorId) => __awaiter(void 0, void 0, void 0, function* () {
    const WithdrawQuery = new QueryBuilder_1.default(withdraw_model_1.Withdraw.find({ mentorId }), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield WithdrawQuery.modelQuery;
    const meta = yield WithdrawQuery.countTotal();
    return { meta, result };
});
const singleWithdrawService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield withdraw_model_1.Withdraw.findById(id);
    return task;
});
const acceptSingleWithdrawService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new AppError_1.default(400, 'Withdraw ID is required');
    }
    // Fetch the withdrawal request
    const withdraw = yield withdraw_model_1.Withdraw.findById(id);
    if (!withdraw) {
        throw new AppError_1.default(404, 'Withdraw not found');
    }
    // Fetch the mentor's wallet
    const wallet = yield wallet_model_1.Wallet.findOne({ mentorId: withdraw.mentorId });
    if (!wallet) {
        throw new AppError_1.default(404, 'Wallet not found for the mentor');
    }
    // Ensure wallet has sufficient funds
    if (wallet.amount < withdraw.amount) {
        throw new AppError_1.default(400, 'Insufficient funds in the wallet');
    }
    // Update the withdrawal status to 'paid'
    const updatedWithdraw = yield withdraw_model_1.Withdraw.findByIdAndUpdate(id, { status: 'paid' }, { new: true });
    // Deduct the amount from the wallet asynchronously
    process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield wallet_model_1.Wallet.findOneAndUpdate({ mentorId: withdraw.mentorId }, { $inc: { amount: -withdraw.amount } }, { new: true });
        }
        catch (error) {
            console.error('Error updating wallet balance:', error);
        }
    }));
    return updatedWithdraw;
});
const deleteSingleWithdrawService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdraw_model_1.Withdraw.deleteOne({ _id: id });
    return result;
});
exports.withdrawService = {
    addWithdrawService,
    getAllWithdrawService,
    singleWithdrawService,
    getAllWithdrawByMentorService,
    acceptSingleWithdrawService,
    deleteSingleWithdrawService,
};
