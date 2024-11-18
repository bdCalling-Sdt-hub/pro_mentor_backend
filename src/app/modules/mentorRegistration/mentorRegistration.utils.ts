export function generateAvailableTimes(
  startTime: string,
  endTime: string,
  incrementTime: number,
): string[] {
  // Helper function to convert time in HH:MM AM/PM format to minutes
  const timeToMinutes = (time: string) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Helper function to convert minutes back to HH:MM AM/PM format
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const modifier = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${modifier}`;
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


