export function generateAvailableTimes(
  startTime: string,
  endTime: string,
  incrementTime: number,
): string[] {
  // Helper function to convert time in HH:MM format to minutes
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes back to HH:MM format without AM/PM
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Return in 24-hour format (HH:MM)
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convert start and end times to minutes
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Generate available time slots
  const availableTimes: string[] = [];
  for (
    let minutes = startMinutes;
    minutes <= endMinutes;
    minutes += incrementTime
  ) {
    availableTimes.push(minutesToTime(minutes));
  }

  return availableTimes;
}
