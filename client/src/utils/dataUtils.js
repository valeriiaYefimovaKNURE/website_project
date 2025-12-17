
export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
};

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

export const parseStringToDate = (dateString) => {
  const [day, month, year] = dateString.split(".");
  const parsedDate=new Date(`${year}-${month}-${day}`);
  
  if (isNaN(parsedDate)) {
    console.error("Невірний формат дати:", dateString);
    return new Date();
  }
  return parsedDate;
}
export const sortByDateDesc = (arr) => {
  return arr
    .filter(item => item.date) // Фільтруємо елементи без дати
    .sort((a, b) => parseStringToDate(b.date) - parseStringToDate(a.date));
}
export const sortByDateAsc = (arr) => {
  return arr
    .filter(item => item.date)
    .sort((a, b) => parseStringToDate(a.date) - parseStringToDate(b.date));
}