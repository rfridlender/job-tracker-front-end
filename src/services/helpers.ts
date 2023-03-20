export const hourDifferenceCalculator = (startTime: string, endTime: string):string => {
  const startDate = new Date();
    startDate.setHours(parseInt(startTime.substring(0, 2)));
    startDate.setMinutes(parseInt(startTime.substring(3,5)));
  const endDate = new Date();
    endDate.setHours(parseInt(endTime.substring(0, 2)));
    endDate.setMinutes(parseInt(endTime.substring(3,5)));
  return `${((endDate.valueOf() - startDate.valueOf()) / 3600000).toFixed(2)}h`;
}