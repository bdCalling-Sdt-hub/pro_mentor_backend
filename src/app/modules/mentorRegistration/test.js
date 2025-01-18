function generateAvailableSlots({
  startTime,
  endTime,
  startBreakTime,
  endBreakTime,
  bookings,
  duration,
  minimumSlotTime,
}) {
  // console.log({
  //   startTime,
  //   endTime,
  //   startBreakTime,
  //   endBreakTime,
  //   bookings,
  //   duration,
  //   minimumSlotTime,
  // });
  // Helper function to convert time string to Date object (for easier comparison)
  function convertToDate(time) {
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
  function generateTimeSlots(start, end, minSlotDuration) {
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

  const bookedSlots = bookings.map((booking) => {
    return {
      start: convertToDate(booking.startTime),
      end: convertToDate(booking.endTime),
    };
  });

  // // console.log(bookedSlots);
  // console.log('convertToDate endTime');
  // console.log(convertToDate(endTime));

  // Filter out slots that are already booked or fall within break time

  const availableSlots = allSlots.filter((slot, i) => {
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

    // // Check if the slot overlaps with any existing booking
    const isBooked = bookedSlots.find(
      (booking) =>
        (slotStart >= booking.start && slotStart < booking.end) ||
        (slotEnd > booking.start && slotEnd <= booking.end),
    );

    // // console.log({ isBooked });

    if (isBooked) {
      return false; // Slot is already booked
    }

    // // Check if there is enough time left for the requested duration (can't extend beyond the end time)
    if (slotEnd > convertToDate(endTime)) {
      return false; // Slot extends beyond the available end time
    }

    return true; // This slot is available
  });

  // console.log(availableSlots);

  return availableSlots;
}

// Example usage:
const startTime = '09:00 AM';
const endTime = '06:00 PM';
const startBreakTime = '12:00 PM'; // Corrected break start time
const endBreakTime = '12:29 PM'; // Corrected break end time
const bookings = [
  { startTime: '11:15 AM', endTime: '11:59 AM' },
  { startTime: '02:00 PM', endTime: '02:44 PM' },
];
const duration = 45; // duration in minutes
const minimumSlotTime = 15; // minimum slot time in minutes

const availableSlots = generateAvailableSlots({
  startTime,
  endTime,
  startBreakTime,
  endBreakTime,
  bookings,
  duration,
  minimumSlotTime,
});

// const formattedTime = new Date();
// formattedTime.setHours(29);
// formattedTime.setMinutes(30);

// // console.log(formattedTime);
