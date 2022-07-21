let message;
function isEmpty(value) {
  if(!value || value.trim() === ""){
    message = 'გთხოვთ შეავსოთ ყველა ველი'
  return !value || value.trim() === "";
  }
}

function roomIsValid(roomNumber) {
  let roomNumbersArray = [
    "1-1",
    "1-2",
    "1-3",
    "1-4",
    "2-1",
    "2-2",
    "2-3",
    "2-4",
    "3-1",
    "3-2",
    "3-3",
    "3-4",
  ];

  if (process.env.ROOMNUMBERS) {
    roomNumbersArray = process.env.ROOMNUMBERS;
  }

  
    if (roomNumbersArray.includes(roomNumber)){

      return true
    }else{
      message = 'მითითებულია არარსებული ოთახი'
      return false
    }
 
}

function transformDate(date) {
  const transformedDate = new Date(date);
  transformedDate.setHours(0, 0, 0, 0);
  return transformedDate
}

function datesAreValid(bookingstart, bookingend) {
  const startDate = transformDate(bookingstart)
  const endDate = transformDate(bookingend)

  if (startDate < endDate){
    return true
  } else {
    message = "გთხოვთ გადაამოწმოთ თარიღები"
    return false
  };
}

function everyThingIsValid(name, source, room, startDate, endDate) {
  if(
    !isEmpty(name) &&
    !isEmpty(source) &&
    !isEmpty(room) &&
    !isEmpty(startDate) &&
    !isEmpty(endDate) &&
    roomIsValid(room) &&
    datesAreValid(startDate, endDate)
  ){
    const validationData = {
      status: true,
      message: 'ჯავშანი წარმატებიტ დარეგისტრირდა'
    }
    return validationData
  } else {
    const validationData = {
      status: false,
      message
    }
    return validationData
  }
}

function validateDatesForSearch(start, end){
  if(datesAreValid(start, end)
  ){
    const validationData = {
      status: true,
      message: ''
    }
    return validationData
  } else {
    const validationData = {
      status: false,
      message
    }
    return validationData
  }
}

module.exports = {
  everyThingIsValid: everyThingIsValid,
  validateDatesForSearch: validateDatesForSearch
};
