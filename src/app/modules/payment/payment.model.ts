import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sheduleBookingId: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true },
);

paymentSchema.pre('validate', function (next) {
  if (this.method === 'bank') {
    if (!this.bankDetails || !this.bankDetails.accountPiNumber) {
      return next(new Error('Bank details are required for bank withdrawals.'));
    }
  } else if (this.method === 'paypal_pay') {
    if (!this.paypalPayDetails || !this.paypalPayDetails.paypalId) {
      return next(
        new Error('GooglePay details are required for Google withdrawals.'),
      );
    }
  } else if (this.method === 'apple_pay') {
    if (!this.applePayDetails || !this.applePayDetails.appleId) {
      return next(
        new Error('ApplePay details are required for Apple withdrawals.'),
      );
    }
  }
  next();
});

export const Payment = model<TPayment>('Payment', paymentSchema);
