"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    mentorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    menteeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    sheduleBookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ScheduleBooking',
        required: false,
    },
    amount: { type: Number, required: true },
    adminAmount: { type: Number, required: false },
    method: {
        type: String,
        enum: ['bank', 'paypal_pay', 'apple_pay'],
        required: true,
    },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    bankDetails: {
        accountPiNumber: { type: String },
    },
    paypalPayDetails: {
        paypalId: { type: String },
        // required: false,
    },
    applePayDetails: {
        appleId: { type: String },
        // required: false,
    },
    transactionId: {
        type: String,
        required: true,
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
paymentSchema.pre('validate', function (next) {
    if (this.method === 'bank') {
        if (!this.bankDetails || !this.bankDetails.accountPiNumber) {
            return next(new Error('Bank details are required for bank withdrawals.'));
        }
    }
    else if (this.method === 'paypal_pay') {
        if (!this.paypalPayDetails || !this.paypalPayDetails.paypalId) {
            return next(new Error('GooglePay details are required for Google withdrawals.'));
        }
    }
    else if (this.method === 'apple_pay') {
        if (!this.applePayDetails || !this.applePayDetails.appleId) {
            return next(new Error('ApplePay details are required for Apple withdrawals.'));
        }
    }
    next();
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
