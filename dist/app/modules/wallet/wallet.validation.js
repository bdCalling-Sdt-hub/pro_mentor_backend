"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletValidation = exports.walletSchema = void 0;
const zod_1 = require("zod");
// Zod schema for video validation
exports.walletSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z
            .string()
            .nonempty('User ID is required'),
        amount: zod_1.z.number().min(0, 'Amount cannot be negative').default(0),
    }),
});
exports.walletValidation = {
    walletSchema: exports.walletSchema,
};
