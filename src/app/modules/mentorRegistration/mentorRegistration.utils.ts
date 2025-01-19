import { sendEmail } from "../../utils/mailSender";

function generateAvailableSlots({
  startTime,
  endTime,
  startBreakTime,
  endBreakTime,
  bookings,
  duration,
  minimumSlotTime,
}: any) {
  // // console.log({
  //   startTime,
  //   endTime,
  //   startBreakTime,
  //   endBreakTime,
  //   bookings,
  //   duration,
  //   minimumSlotTime,
  // });
  // Helper function to convert time string to Date object (for easier comparison)
  function convertToDate(time: any) {
    // console.log({ time });
    const [timeStr, period] = time.split(' ');
    // console.log({ timeStr });
    // console.log({ period });
    const [hours, minutes] = timeStr.split(':').map(Number);
    // console.log({ hours });
    // console.log({ minutes });
    // // console.log({ hours, minutes });
    const formattedTime = new Date();

    // Handle AM/PM conversion
    if (period === 'AM') {
      // console.log('period AM', period);
      if (hours === 12) {
        formattedTime.setHours(hours + 12);
      } else {
        formattedTime.setHours(hours);
      }
    } else {
      if (hours === 12) {
        formattedTime.setHours(hours);
      } else {
        formattedTime.setHours(hours + 12);
      }
    }
    formattedTime.setMinutes(minutes);
    return formattedTime;
  }

  // Helper function to generate time slots between start and end times
  function generateTimeSlots(start: any, end: any, minSlotDuration: any) {
    // console.log('start', start);
    // console.log('end', end);
    const slots = [];
    let currentTime = convertToDate(start);
    const endTime = convertToDate(end);

    // console.log({ currentTime });
    // console.log({ endTime });

    // Generate slots based on minimum slot time
    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime());
      // console.log({ nextTime });
      nextTime.setMinutes(currentTime.getMinutes() + minSlotDuration);

      // console.log({ nextTime });

      if (nextTime <= endTime) {
        slots.push(
          `${currentTime.getHours() < 13 ? currentTime.getHours() : currentTime.getHours() - 12}:${String(currentTime.getMinutes()).padStart(2, '0')} ${currentTime.getHours() < 12 ? 'AM' : 'PM'}`,
        );
      }

      currentTime = nextTime;
    }
    return slots;
  }

  // Generate all possible slots between startTime and endTime
  const allSlots = generateTimeSlots(startTime, endTime, minimumSlotTime);

  // console.log({ allSlots });

  // Convert break times and bookings to comparable date objects
  const breakStart = convertToDate(startBreakTime);

  // console.log({ breakStart });
  const breakEnd = convertToDate(endBreakTime);

  // console.log({ breakEnd });

  const bookedSlots = bookings.map((booking: any) => {
    return {
      start: convertToDate(booking.startTime),
      end: convertToDate(booking.endTime),
    };
  });

  // console.log('.........1............');
  // console.log('bookedSlots', bookedSlots);
  // console.log('.........2............');

  // // console.log(bookedSlots);
  // console.log('convertToDate endTime');
  // console.log(convertToDate(endTime));

  // Filter out slots that are already booked or fall within break time

  const availableSlots = allSlots.filter((slot, i) => {
    // console.log('.........1............');
    // console.log(slot)
    // console.log('.........2............');
    const slotStart = convertToDate(slot);
    const slotEnd = new Date(slotStart.getTime());
    slotEnd.setMinutes(slotStart.getMinutes() + duration - 1);

    // // console.log('.........start............');
    // // console.log({ slotStart });
    // // console.log({ breakStart });
    // // console.log({ slotEnd });
    // // console.log(convertToDate(endTime));
    // // console.log({ breakEnd });
    // // console.log('.........end............');

    // Check if the slot is during the break time
    if (slotStart >= breakStart && slotStart <= breakEnd) {
      // // console.log('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttt');
      return false; // Slot is during break time
    }

    const isBooked = bookedSlots.find(
      (booking: any) =>
        
        (slotStart >= booking.start && slotStart < booking.end) ||
        (slotEnd > booking.start && slotEnd <= booking.end),
    );

    // console.log({ slotStart });
    // console.log({ isBooked });
    // console.log({ slotEnd });

    if (isBooked) {
      return false; // Slot is already booked
    }


    if (slotEnd > convertToDate(endTime)) {
      return false; // Slot extends beyond the available end time
    }

    return true; // This slot is available
  });

  // console.log(availableSlots);

  return availableSlots;
}

export { generateAvailableSlots };

function convertToMinutes(time: string): number {
  const [hours, minutes, period] = time.split(/[:\s]+/);
  let totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  if (period.toUpperCase() === 'PM' && parseInt(hours, 10) !== 12) {
    totalMinutes += 12 * 60; // Convert PM times to 24-hour format
  }
  if (period.toUpperCase() === 'AM' && parseInt(hours, 10) === 12) {
    totalMinutes -= 12 * 60; // Convert 12 AM to 0:00 hours
  }
  return totalMinutes;
}

export { convertToMinutes };

function isTimeOverlap(
  mentorStart: string,
  mentorEnd: string,
  queryStart: string,
  queryEnd: string,
): boolean {
  const mentorStartMinutes = convertToMinutes(mentorStart);
  const mentorEndMinutes = convertToMinutes(mentorEnd);
  const queryStartMinutes = convertToMinutes(queryStart);
  const queryEndMinutes = convertToMinutes(queryEnd);

  // Check if the times overlap
  return (
    mentorStartMinutes < queryEndMinutes && mentorEndMinutes > queryStartMinutes
  );
}

export { isTimeOverlap };



export const cancellationRegistrationEmail = async ({
  sentTo,
  subject,
  name,
  rejone,
}: {
  sentTo: string;
  subject: string;
  name: string;
  rejone: any;
}): Promise<void> => {
 
  await sendEmail(
    sentTo,
    subject,
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background-color: #f9f9f9;">
      <h1 style="text-align: center; color: #FF6347;">Registration Cancelled</h1>
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
      <p style="font-size: 16px; color: #333;">We are sorry to inform you that your registration for the <strong>Pro Mentors Website</strong> has been cancelled. If you did not request this cancellation or believe this to be an error, please contact us immediately.</p>
      <div style="background-color: #fff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-top: 20px;">
        <h3 style="color: #333;">Details of Your Cancellation:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Cancellation Reason:</strong> ${rejone.rejone}</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #333; margin-top: 20px;">If you would like to register again or need further assistance, feel free to reach out to us. We are here to help!</p>
      <p style="font-size: 16px; color: #333;">Best regards,</p>
      <p style="font-size: 16px; color: #333;">The <strong>Pro Mentors</strong> Team</p>
    </div>`,
  );
};

export const acceptanceRegistrationEmail = async ({
  sentTo,
  subject,
  name,
}: {
  sentTo: string;
  subject: string;
  name: string;
}): Promise<void> => {
  await sendEmail(
    sentTo,
    subject,
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background-color: #f9f9f9;">
      <h1 style="text-align: center; color: #4CAF50;">Registration Accepted</h1>
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
      <p style="font-size: 16px; color: #333;">We are happy to inform you that your registration for the <strong>Pro Mentors Website</strong> has been successfully accepted. Congratulations!</p>
      <div style="background-color: #fff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-top: 20px;">
        <h3 style="color: #333;">Details of Your Acceptance:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Status:</strong> Accepted</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #333; margin-top: 20px;">We are excited to have you onboard! Right now login and explor our app.!!</p>
      <p style="font-size: 16px; color: #333;">Best regards,</p>
      <p style="font-size: 16px; color: #333;">The <strong>Pro Mentors</strong> Team</p>
    </div>`,
  );
};
