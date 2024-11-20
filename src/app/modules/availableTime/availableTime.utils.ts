import moment from 'moment';

export const generateSlotsForDays = (startTime: string, endTime: string) => {
  console.log('startTime', startTime);
  console.log('endTime', endTime);

  // Parse the time strings into valid Date objects using moment.js
  const start:any = moment(startTime, 'hh:mm A').toDate(); // Parses time like '09:00 AM'
  const end:any = moment(endTime, 'hh:mm A').toDate(); // Parses time like '11:00 AM'

  console.log('start end', { start, end });

  const slots: any = [];
  let currentTime:any = new Date(start);

  // Loop through the time range and generate the slots
  while (currentTime <= end) {
    const nextTime:any = new Date(currentTime);
    console.log('nextTime', nextTime);
    nextTime.setHours(currentTime.getHours() + 1); // increment by 1 hour for the next slot

    const duration = (end - currentTime) / (1000 * 60 * 60); // calculate the remaining duration in hours

    // Format current time slot to HH:mm
    const formattedTime = moment(currentTime).format('HH:mm'); // Use moment.js to format the time
    console.log('formattedTime', formattedTime);

    // Add the slot to the array
    slots.push({
      time: formattedTime,
      duration: duration >= 0 ? duration : 0, // Ensure the duration doesn't go negative
    });

    currentTime = nextTime; // Move to the next slot
  }

  return slots;
};


