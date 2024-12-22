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
exports.availableService = void 0;
const mentorRegistration_model_1 = require("../mentorRegistration/mentorRegistration.model");
const shediulBooking_model_1 = __importDefault(require("../shediulBooking/shediulBooking.model"));
// import { generateSlotsForDays } from './availableTime.utils';
const createAvailableService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('availableTime', payload);
    //  const result = generateSlotsForDays(
    //  );
    //  console.log('result', result);
    //   const result = await AvailableTime.create(payload);
    //   if (!result) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Available time added!!');
    //   }
    return payload;
});
// Helper function to normalize time format (HH:mm AM/PM -> HH:mm)
// Helper function to normalize time to 24-hour format (HH:mm)
const normalizeTime = (time) => {
    const [hourMin, period] = time.split(' ');
    let [hour, minute] = hourMin.split(':');
    // Handle PM case
    if (period === 'PM' && +hour !== 12) {
        hour = (parseInt(hour) + 12).toString(); // Convert PM to 24-hour format
    }
    // Handle AM case
    if (period === 'AM' && +hour === 12) {
        hour = '00'; // Convert 12 AM to 00
    }
    return `${hour}:${minute}`;
};
// Generate time slots for a given available time range
const generateSlotsForDays = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${normalizeTime(startTime)}:00`);
    const end = new Date(`1970-01-01T${normalizeTime(endTime)}:00`);
    const slots = [];
    while (start < end) {
        const slot = new Date(start);
        slots.push(slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
    }
    return slots;
};
// Function to filter out unavailable slots based on bookings
const filterUnavailableSlots = (availableSlots, bookings) => {
    const unavailableSlots = [];
    bookings.forEach((booking) => {
        const { startTime, endTime } = booking;
        const normalizedBookingStart = normalizeTime(startTime);
        const normalizedBookingEnd = normalizeTime(endTime);
        // Find the indices of the booking start and end times in the available slots
        let bookingStartIndex = availableSlots.indexOf(normalizedBookingStart);
        let bookingEndIndex = availableSlots.indexOf(normalizedBookingEnd);
        if (bookingStartIndex !== -1 && bookingEndIndex !== -1) {
            // If the booking falls within available slots, exclude these slots
            unavailableSlots.push(...availableSlots.slice(bookingStartIndex, bookingEndIndex + 1));
        }
    });
    return unavailableSlots;
};
// Main service function to get available slots
const getMentorAvailableTimeService = (mentorId, date) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('mentorId:', mentorId);
    console.log('date:', date);
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    console.log('Day of the week:', dayName);
    // 1. Check if the mentor is available on the specified day
    const mentorAvailability = yield mentorRegistration_model_1.MentorRegistration.findOne({
        mentorId,
        preferredDays: { $in: [dayName] },
    });
    if (!mentorAvailability) {
        throw new Error('The mentor is not available on this day');
    }
    console.log('Mentor available:', mentorAvailability);
    const { startTime: mentorStartTime, endTime: mentorEndTime } = mentorAvailability;
    // 2. Find all bookings for the mentor on the specified date
    const bookings = yield shediulBooking_model_1.default.find({
        mentorId,
        bookingDate: new Date(date), // Date should match exactly
    });
    console.log('Bookings on this day:', bookings);
    // 3. Generate all possible time slots for the mentor's available time range
    const availableSlots = generateSlotsForDays(mentorStartTime, mentorEndTime);
    console.log('availableSlots:', availableSlots);
    // 4. Filter out unavailable slots based on existing bookings
    const unavailableSlots = filterUnavailableSlots(availableSlots, bookings);
    console.log('unavailableSlots:', unavailableSlots);
    // 5. Filter out the unavailable slots from the available slots
    const finalAvailableSlots = availableSlots.filter((slot) => !unavailableSlots.includes(slot));
    console.log('Final Available Slots:', finalAvailableSlots);
    return finalAvailableSlots;
});
// const getSingleAvailableQuery = async (id: string) => {
//   const available = await Available.findById(id);
//   if (!Available) {
//     throw new AppError(404, 'Available Not Found!!');
//   }
//   const result = await Available.aggregate([
//     { $match: { _id: new mongoose.Types.ObjectId(id) } },
//   ]);
//   if (result.length === 0) {
//     throw new AppError(404, 'Available not found!');
//   }
//   return result[0];
// };
// const updateAvailableQuery = async (
//   id: string,
//   payload: Partial<TAvailable>,
//   userId: string,
// ) => {
//   if (!id || !userId) {
//     throw new AppError(400, 'Invalid input parameters');
//   }
//   const result = await Available.findOneAndUpdate(
//     { _id: id, menteeId: userId },
//     payload,
//     { new: true, runValidators: true },
//   );
//   // If no matching Available is found, throw an error
//   if (!result) {
//     throw new AppError(404, 'Available Not Found or Unauthorized Access!');
//   }
//   return result;
// };
// const deletedAvailableQuery = async (id: string, userId: string) => {
//   if (!id || !userId) {
//     throw new AppError(400, 'Invalid input parameters');
//   }
//   const result = await Available.findOneAndDelete({ _id: id, menteeId: userId });
//   // If no matching Available is found, throw an error
//   if (!result) {
//     throw new AppError(404, 'Available Not Found!');
//   }
//   return result;
// };
exports.availableService = {
    createAvailableService,
    getMentorAvailableTimeService,
    //   getSingleAvailableQuery,
    //   updateAvailableQuery,
    //   deletedAvailableQuery,
    //   getSettings,
};
