const generateSlotsForDays = (days:any, startTime:any, endTime:any) => {
  const slots = days.map((day:any) => {
    // Create the start and end date objects
    const start = new Date(day);
    start.setHours(startTime, 0, 0, 0);

    const end = new Date(day);
    end.setHours(endTime, 0, 0, 0);

    return {
      day: new Date(day).toDateString(), // Store the day name (e.g., "Sat Nov 16 2024")
      start: start.toISOString(), // Convert start time to ISO string
      end: end.toISOString(), // Convert end time to ISO string
    };
  });

  return slots;
};

// Example Usage
const preferredDays = [
  new Date('2024-11-16'), // Saturday
  new Date('2024-11-17'), // Sunday
];
const startTime = 10; // 10:00 AM
const endTime = 14; // 2:00 PM

const slots = generateSlotsForDays(preferredDays, startTime, endTime);
console.log(slots);
