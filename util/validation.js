function isEmpty(value) {
  return !value || value.trim() === "";
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

  return roomNumbersArray.includes(roomNumber);
}

function datesAreValid(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return startDate < endDate && startDate > today;
}

function everyThingIsValid(name, source, room, startDate, endDate) {
  return (
    !isEmpty(name) &&
    !isEmpty(source) &&
    !isEmpty(room) &&
    !isEmpty(startDate) &&
    !isEmpty(endDate) &&
    roomIsValid(room) &&
    datesAreValid(startDate, endDate)
  )
  
}

module.exports = {
  everyThingIsValid: everyThingIsValid,
};
