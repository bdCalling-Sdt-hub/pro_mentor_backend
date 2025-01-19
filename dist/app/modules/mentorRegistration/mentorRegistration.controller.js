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
exports.mentorRegistrationController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const mentorRegistration_service_1 = require("./mentorRegistration.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
const tokenManage_1 = require("../../utils/tokenManage");
// import { generateAvailableTimes } from './mentorRegistration.utils';
const createMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.token;
    // console.log('body -1', req.body);
    req.body.preferredDays = JSON.parse(req.body.preferredDays);
    // console.log('token -2', token);
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token is required');
    }
    const decodeData = (0, tokenManage_1.verifyToken)({
        token,
        access_secret: config_1.default.jwt_access_secret,
    });
    if (!decodeData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid token');
    }
    const { userId } = decodeData;
    // console.log('userId -3', userId);
    // console.log('req.files -3', req.files);
    const files = req.files;
    // Access body and files
    const bodyData = req.body;
    // duplicate check by email  // todo
    // // console.log(files);
    if (!files ||
        !files['introVideo'] ||
        !files['professionalCredential'] ||
        !files['additionalDocument']) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Both introvideo and document files are required');
    }
    const introVideo = files['introVideo'][0];
    const professionalCredential = files['professionalCredential'];
    const additionalDocument = files['additionalDocument'];
    const videoPath = introVideo.path.replace(/^public[\\/]/, '');
    const professionalCredentialPath = professionalCredential.map((credential) => credential.path.replace(/^public[\\/]/, ''));
    const additionalDocumentPath = additionalDocument.map((credential) => credential.path.replace(/^public[\\/]/, ''));
    // console.log({ professionalCredential });
    // console.log({ professionalCredentialPath });
    const availableTimeSlots = `${bodyData.startTime} - ${bodyData.endTime}`; // todo
    const endBreaktime = bodyData.endBreakTime - 1;
    bodyData.endBreaktime = endBreaktime;
    const payload = Object.assign(Object.assign({}, bodyData), { mentorId: userId, introVideo: videoPath, professionalCredential: professionalCredentialPath, additionalDocument: additionalDocumentPath, availableTime: availableTimeSlots });
    // // console.log('payload payload', payload);
    // console.log('............controller............');
    const result = yield mentorRegistration_service_1.mentorRegistrationService.createMentorRegistrationService(payload); // todo email sent to admin
    // console.log('result result ', result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Registration successfully!!',
        data: result,
    });
}));
const getallMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    // console.log('query', query);
    let filtersQuery = {};
    // if (Object.keys(query).length > 0) {
    //   filtersQuery = Object.entries(query).reduce((acc: any, [key, value]) => {
    //     // Only include key-value pairs where value is not an empty string or an empty array
    //     if (typeof value === 'string' && value.trim() !== '') {
    //       acc[key] = value.trim();
    //     } else if (Array.isArray(value) && value.length > 0) {
    //       // Keep non-empty arrays (e.g., 'industryExpertise')
    //       acc[key] = value;
    //     }
    //     return acc;
    //   }, {});
    // }
    // // console.log('filtersQuery', filtersQuery);
    if (Object.keys(query).length > 0) {
        filtersQuery = Object.entries(query).reduce((acc, [key, value]) => {
            // Only process string values
            if (typeof value === 'string') {
                try {
                    // Check if the string looks like an array (e.g., "['Finance']")
                    if (value.startsWith('[') && value.endsWith(']')) {
                        // Parse the string to convert to an actual array
                        const parsedValue = JSON.parse(value.replace(/'/g, '"'));
                        // If it's an empty array (e.g., '[]'), ignore it
                        if (Array.isArray(parsedValue) && parsedValue.length > 0) {
                            acc[key] = parsedValue; // Add to filtersQuery
                        }
                    }
                    else {
                        // If not an array-like string, just add it as is
                        acc[key] = value;
                    }
                }
                catch (error) {
                    console.error('Error parsing array string:', error);
                }
            }
            else if (Array.isArray(value)) {
                // If value is already an array (e.g., multiple values for the same key), keep it as is
                acc[key] = value;
            }
            return acc;
        }, {});
    }
    // Here you can process your filtersQuery or pass it to your database query
    // // console.log('Processed filtersQuery:', filtersQuery);
    const { meta, result } = yield mentorRegistration_service_1.mentorRegistrationService.getAllMentorRegistrationQuery(filtersQuery);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: 'Mentor Registration All are requered successful!!',
    });
}));
const getMentorAvailableSlots = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = req.params;
    const { duration, date } = req.query;
    const payload = {
        mentorId,
        duration,
        date,
    };
    const result = yield mentorRegistration_service_1.mentorRegistrationService.getMentorAvailableSlots(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Mentor Available Slots are requered successful!!',
    });
}));
const getSingleMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentorRegistration_service_1.mentorRegistrationService.getSingleMentorRegistrationQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single Mentor are requered successful!!',
    });
}));
const getAdminMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meta, result } = yield mentorRegistration_service_1.mentorRegistrationService.getAdminMentorQuery(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: 'Mentor Registration All are requered successful!!',
    });
}));
const getMentorRegistrationOnly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield mentorRegistration_service_1.mentorRegistrationService.getMentorRegistrationOnly(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'My Registration are requered successful!!',
    });
}));
const updateSingleMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // // console.log('update payload');
    const files = req.files;
    // // console.log('files', files);
    // Access body and files
    const payload = req.body;
    // console.log('payload........1', payload);
    // req.body.preferredDays = JSON.parse(req.body.preferredDays);
    if (payload.preferredDays) {
        try {
            payload.preferredDays = JSON.parse(payload.preferredDays);
        }
        catch (err) {
            // console.log('Error parsing preferredDays:', err);
        }
    }
    // // console.log('payload........2', payload);
    // Handle introVideo file upload
    if (files && files['introVideo'] && files['introVideo'].length > 0) {
        const introVideo = files['introVideo'][0];
        const videoPath = introVideo.path.replace(/^public[\\/]/, '');
        if (videoPath) {
            payload.introVideo = videoPath;
        }
    }
    else {
        // console.log('No intro video uploaded');
    }
    // Handle image file upload
    if (files && files['image'] && files['image'].length > 0) {
        const image = files['image'][0];
        const imagePath = image.path.replace(/^public[\\/]/, '');
        if (imagePath) {
            payload.image = imagePath;
        }
    }
    else {
        // console.log('No image uploaded');
    }
    if (payload.startTime && payload.endTime) {
        payload.availableTime = `${payload.startTime} - ${payload.endTime}`;
    }
    // // console.log('update payload', payload);
    const result = yield mentorRegistration_service_1.mentorRegistrationService.updateMentorRegistrationQuery(req.params.id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Updated Single Mentor successfully!',
    });
}));
const acceptSingleMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentorRegistration_service_1.mentorRegistrationService.acceptSingleMentorRegistrationService(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Updated Single Mentor are successful!!',
    });
}));
const cencelSingleMentorRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rejone = req.body;
    const result = yield mentorRegistration_service_1.mentorRegistrationService.cencelSingleMentorRegistrationService(req.params.id, rejone);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Updated Single Mentor are successful!!',
    });
}));
exports.mentorRegistrationController = {
    createMentorRegistration,
    getallMentorRegistration,
    getMentorAvailableSlots,
    getMentorRegistrationOnly,
    getAdminMentorRegistration,
    getSingleMentorRegistration,
    updateSingleMentorRegistration,
    acceptSingleMentorRegistration,
    cencelSingleMentorRegistration,
};
