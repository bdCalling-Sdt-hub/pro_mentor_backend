"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_routes_1 = require("../modules/otp/otp.routes");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const setting_route_1 = __importDefault(require("../modules/settings/setting.route"));
const mentorRegistration_route_1 = __importDefault(require("../modules/mentorRegistration/mentorRegistration.route"));
const video_route_1 = __importDefault(require("../modules/video/video.route"));
const review_route_1 = __importDefault(require("../modules/review/review.route"));
const wallet_route_1 = __importDefault(require("../modules/wallet/wallet.route"));
const payment_route_1 = __importDefault(require("../modules/payment/payment.route"));
const taskGoal_route_1 = __importDefault(require("../modules/taskGoal/taskGoal.route"));
const availableTime_route_1 = __importDefault(require("../modules/availableTime/availableTime.route"));
const shediulBooking_route_1 = __importDefault(require("../modules/shediulBooking/shediulBooking.route"));
const mentorBooking_route_1 = __importDefault(require("../modules/mentorBooking/mentorBooking.route"));
const withdraw_route_1 = __importDefault(require("../modules/withdraw/withdraw.route"));
const notification_route_1 = __importDefault(require("../modules/notification/notification.route"));
const chat_route_1 = __importDefault(require("../modules/chat/chat.route"));
const message_route_1 = __importDefault(require("../modules/message/message.route"));
const mentorShediulPricing_route_1 = require("../modules/mentorShediulPricing/mentorShediulPricing.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/otp',
        route: otp_routes_1.otpRoutes,
    },
    {
        path: '/setting',
        route: setting_route_1.default,
    },
    {
        path: '/notification',
        route: notification_route_1.default,
    },
    {
        path: '/mentorRegistration',
        route: mentorRegistration_route_1.default,
    },
    {
        path: '/video',
        route: video_route_1.default,
    },
    {
        path: '/review',
        route: review_route_1.default,
    },
    {
        path: '/wallet',
        route: wallet_route_1.default,
    },
    {
        path: '/payment',
        route: payment_route_1.default,
    },
    {
        path: '/withdraw',
        route: withdraw_route_1.default,
    },
    {
        path: '/taskGoal',
        route: taskGoal_route_1.default,
    },
    {
        path: '/shediulBooking',
        route: shediulBooking_route_1.default,
    },
    {
        path: '/availableTime',
        route: availableTime_route_1.default,
    },
    {
        path: '/mentorBooking',
        route: mentorBooking_route_1.default,
    },
    {
        path: '/chat',
        route: chat_route_1.default,
    },
    {
        path: '/message',
        route: message_route_1.default,
    },
    {
        path: '/shediul-pricing',
        route: mentorShediulPricing_route_1.shediulPricingRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
