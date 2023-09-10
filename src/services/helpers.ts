export const hourDifferenceCalculator = (startTime: string, endTime: string):string => {
  const startDate = new Date();
    startDate.setHours(parseInt(startTime.substring(0, 2)));
    startDate.setMinutes(parseInt(startTime.substring(3,5)));
  const endDate = new Date();
    endDate.setHours(parseInt(endTime.substring(0, 2)));
    endDate.setMinutes(parseInt(endTime.substring(3,5)));
  return `${((endDate.valueOf() - startDate.valueOf()) / 3600000).toFixed(2)}h`;
}

export const twentyFourToTwelveConvertor = (time: string):string => {
  const hours = parseInt(time.substring(0, 2));
  // 0 - 23
  const minutes = parseInt(time.substring(3, 5));
  const halfOfDay = hours < 12 ? 'AM' : 'PM';
  const hoursToString = (hours % 12) < 10 ? 
    `0${(hours % 12).toString()}` : (hours % 12).toString();
  const minutesToString = minutes < 10 ? 
    `0${(minutes).toString()}` : (minutes).toString();
  return `${hoursToString}:${minutesToString} ${halfOfDay}`;
}