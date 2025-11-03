// Helper function to format dates as "November 15th ~ 16th, 2025"
export function formatEventDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const startDay = start.getDate();
  const startYear = start.getFullYear();
  
  const endDay = end.getDate();
  const endYear = end.getFullYear();
  
  // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const startSuffix = getOrdinalSuffix(startDay);
  const endSuffix = getOrdinalSuffix(endDay);
  
  // If same year, only show year at the end
  if (startYear === endYear) {
    return `${startMonth} ${startDay}${startSuffix} ~ ${endDay}${endSuffix}, ${startYear}`;
  } else {
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
    return `${startMonth} ${startDay}${startSuffix}, ${startYear} ~ ${endMonth} ${endDay}${endSuffix}, ${endYear}`;
  }
}

// Helper function to format time as "10:00 am to 5:00 pm"
export function formatEventTime(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${startTime} to ${endTime}`;
}

