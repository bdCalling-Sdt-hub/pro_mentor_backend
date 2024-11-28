// export function generateAvailableTimes(
//   startTime: string,
//   endTime: string,
//   incrementTime: number,
// ): string[] {
//   // Helper function to convert time in HH:MM format to minutes
//   const timeToMinutes = (time: string) => {
//     const [hours, minutes] = time.split(':').map(Number);
//     return hours * 60 + minutes;
//   };

//   // Helper function to convert minutes back to HH:MM format without AM/PM
//   const minutesToTime = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;

//     // Return in 24-hour format (HH:MM)
//     return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
//   };

//   // Convert start and end times to minutes
//   const startMinutes = timeToMinutes(startTime);
//   const endMinutes = timeToMinutes(endTime);

//   // Generate available time slots
//   const availableTimes: string[] = [];
//   for (
//     let minutes = startMinutes;
//     minutes <= endMinutes;
//     minutes += incrementTime
//   ) {
//     availableTimes.push(minutesToTime(minutes));
//   }

//   return availableTimes;
// }

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

export  {convertToMinutes};


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