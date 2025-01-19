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
exports.generateZoomMeetingLink = void 0;
const moment_1 = __importDefault(require("moment"));
const mailSender_1 = require("../../utils/mailSender");
const shediulBooking_model_1 = __importDefault(require("./shediulBooking.model"));
const node_cron_1 = __importDefault(require("node-cron"));
const axios = require('axios');
const ZOOM_BASE_URL = process.env.ZOOM_BASE_URL;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
// Function to get OAuth token
function getZoomAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenUrl = `${ZOOM_BASE_URL}/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;
        const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
        try {
            const response = yield axios.post(tokenUrl, null, {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('Error fetching Zoom access token:', error.response.data);
            throw new Error('Failed to retrieve access token');
        }
    });
}
// Utility to format the date and time into ISO 8601 format
function formatDateTime(date, time) {
    const currentDate = date ? new Date(date) : new Date(); // Use provided date or default to current date
    // Parse time (default to '12:00 PM' if time not provided)
    const [timePart, meridian] = time ? time.split(' ') : ['12:00', 'PM'];
    let [hours, minutes] = timePart.split(':').map(Number);
    // Adjust hours based on AM/PM
    if (meridian.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
    }
    else if (meridian.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }
    // Set the time on the currentDate
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    // Return the date in ISO 8601 format
    return currentDate.toISOString();
}
const generateZoomMeetingLink = (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, agenda, date, time, duration, }) {
    try {
        const accessToken = yield getZoomAccessToken();
        // console.log('accessToken accessToken', accessToken);
        // Format the date and time into ISO 8601
        const startTime = formatDateTime(date, time); // Use default date and time if not provided
        // Create meeting options
        const meetingOptions = {
            topic: topic || 'Online Meeting', // Default topic if none provided
            agenda: agenda || '', // Set the agenda
            type: 2, // Scheduled meeting
            start_time: startTime, // Set the formatted start time
            duration: duration, // Default duration is 60 minutes
            settings: {
                host_video: false, // Do not start with host video on
                participant_video: false, // Do not start with participant video on
                join_before_host: true, // Allow participants to join before host
                enforce_login: false, // Disable login enforcement (optional)
                waiting_room: false, // Disable waiting room so participants can join directly
            },
        };
        // Make a POST request to create the meeting
        const response = yield axios.post(`${ZOOM_BASE_URL}/v2/users/me/meetings`, meetingOptions, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        // Calculate meeting end time based on start time and duration
        const endTime = new Date(new Date(startTime).getTime() + (duration || 60) * 60000);
        // Return the meeting details
        return {
            meetingLink: response.data.join_url,
            startTime: response.data.start_time,
            endTime: endTime.toISOString(),
            agenda: response.data.agenda,
        };
    }
    catch (error) {
        console.error('Error creating Zoom meeting:', error.response ? error.response.data : error.message);
        throw new Error('Failed to create Zoom meeting');
    }
});
exports.generateZoomMeetingLink = generateZoomMeetingLink;
// Example usage
// const meetingDetails = await generateZoomMeetingLink({
//   topic: 'Project Meeting',
//   agenda: 'Discuss project milestones',
//   date: '2024-12-08',
//   time: '3:30 PM',
//   duration: 90,
// });
// // console.log(meetingDetails);
exports.default = { getZoomAccessToken, formatDateTime };
const joinScheduleBookingZoomLinkEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Fetch all the scheduled bookings and populate mentee and mentor details
        // console.log('current date', new Date());
        // Get the current date without time (midnight of today)
        const todayStart = (0, moment_1.default)().startOf('day').toDate();
        const todayEnd = (0, moment_1.default)().endOf('day').toDate();
        // console.log({ todayStart, todayEnd });
        const bookingScheduleData = yield shediulBooking_model_1.default.find({
            bookingDate: {
                $gte: todayStart, // Greater than or equal to midnight
                $lt: todayEnd, // Less than tomorrow
            },
        })
            .populate('menteeId')
            .populate('mentorId');
        // console.log({ bookingScheduleData });
        const currentTime = new Date().getTime();
        // console.log('currentTime', currentTime);
        // Loop through all bookings
        for (const booking of bookingScheduleData) {
            const mentee = booking.menteeId;
            const mentor = booking.mentorId;
            const zoomLink = (_a = booking === null || booking === void 0 ? void 0 : booking.zoomMeetingId) === null || _a === void 0 ? void 0 : _a.meetingLink;
            const bookingTime = booking === null || booking === void 0 ? void 0 : booking.startTime;
            // console.log({ bookingTime });
            const bookingStartTime = (0, moment_1.default)(bookingTime, 'hh:mm A').toDate().getTime();
            // console.log({ bookingStartTime });
            // Calculate the difference in minutes between the booking start time and the current time
            const timeMinus = bookingStartTime - currentTime;
            // console.log({ timeMinus });
            // const timeMinusInMinutes = timeMinus / 1000 / 60;
            // // console.log({ timeMinusInMinutes });
            // Check if the current time is exactly 2 minutes before the start time
            if (timeMinus <= 10 * 60 * 1000 && timeMinus > 0) {
                const subject = `Reminder: Your session on ${booking.subject} is about to start`;
                // Email body template
                const emailBody = `
          <h1>Meeting Scheduled for ${booking.subject}</h1>
          <p>Hello ${mentee === null || mentee === void 0 ? void 0 : mentee.fullName},</p>
          <p>Your session with ${mentor === null || mentor === void 0 ? void 0 : mentor.fullName} is about to start. Please join the meeting 
  <span style="font-size: 24px; font-weight: bold; color: red;"> ${bookingTime} </span> 
  before the session starts using the Zoom link below:</p>
          <p><a href="${zoomLink}" target="_blank">Join Zoom Meeting</a></p>
          <p>Thank you, and we wish you a great session!</p>
        `;
                // Send email to mentee
                yield (0, mailSender_1.sendEmail)(mentee === null || mentee === void 0 ? void 0 : mentee.email, subject, emailBody);
                // Send email to mentor
                yield (0, mailSender_1.sendEmail)(mentor === null || mentor === void 0 ? void 0 : mentor.email, subject, emailBody);
            }
            else {
                // console.log('The session is not within 10 minutes.');
            }
        }
    }
    catch (error) {
        console.error('Error sending booking emails:', error);
    }
});
// Schedule the cron job to check every minute
node_cron_1.default.schedule('*/5 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Checking for upcoming sessions...');
    yield joinScheduleBookingZoomLinkEmail();
    // console.log('mail send');
}));
// cron.schedule('* * * * *', async () => {
//   // console.log('Checking for upcoming sessions...');
//   await joinScheduleBookingZoomLinkEmail();
// });
// {
//   "_id": "67598a50bbc9d6c263799c9f",
//   "menteeId": "6759887fbbc9d6c263799c5c",
//   "mentorId": "6753d20d593e9f58f0814b98",
//   "subject": "For researching Flower",
//   "jobTitle": "Flutter Developer",
//   "industryField": "Founder",
//   "yearOfExperience": "5 years",
//   "educationLevel": "PhD",
//   "description": "This is Flower",
//   "bookingDate": "2024-12-19T09:00:00.000Z",
//   "bookingTime": "02:45 AM",
//   "duration": 60,
//   "startTime": "02:45 AM",
//   "endTime": "03:44 AM",
//   "status": "Booked",
//   "zoomMeetingId": {
//     "meetingLink": "https://us05web.zoom.us/j/82741095228?pwd=6blutnEIlWUOP3mkN0oGjLYr5xF6a3.1",
//     "startTime": "2024-12-11T12:49:21.000Z",
//     "endTime": "2024-12-11T07:00:20.526Z",
//     "agenda": "Discuss Services"
//   }
// },
// {
//   "_id": "67598a50bbc9d6c263799c9f",
//   "menteeId": "6759887fbbc9d6c263799c5c",
//   "mentorId": "6753d20d593e9f58f0814b98",
//   "subject": "For researching Flower",
//   "jobTitle": "Flutter Developer",
//   "industryField": "Founder",
//   "yearOfExperience": "5 years",
//   "educationLevel": "PhD",
//   "description": "This is Flower",
//   "bookingDate": "2024-12-19T09:00:00.000Z",
//   "bookingTime": "02:45 AM",
//   "duration": 60,
//   "startTime": "02:45 AM",
//   "endTime": "03:44 AM",
//   "status": "Booked",
//   "zoomMeetingId": {
//     "meetingLink": "https://us05web.zoom.us/j/82741095228?pwd=6blutnEIlWUOP3mkN0oGjLYr5xF6a3.1",
//     "startTime": "2024-12-11T12:49:21.000Z",
//     "endTime": "2024-12-11T07:00:20.526Z",
//     "agenda": "Discuss Services"
//   }
// }
