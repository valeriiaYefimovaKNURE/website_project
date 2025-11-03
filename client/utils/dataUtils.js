// из yyyy-mm-dd → dd.mm.yyyy
export const formatToDisplay = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
};

// из dd.mm.yyyy → yyyy-mm-dd
export const formatToInput = (date) => {
  if (!date.includes(".")) return date; 
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};
