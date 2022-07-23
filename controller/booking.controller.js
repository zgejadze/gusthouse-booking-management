const Booking = require("../models/booking");

const validateUtil = require("../util/validation");

function getLanding(req, res) {
  res.render("index");
}

async function saveBooking(req, res) {
  const booking = new Booking({
    ...req.body,
  });

  console.log(req.body);
  const validationResult = validateUtil.everyThingIsValid(
    req.body.name,
    req.body.source,
    req.body.room,
    req.body.startDate,
    req.body.endDate
  );

  if (validationResult.status) {
    await booking.save();
    console.log("booking saved");
    res.status(201).json({
      message: validationResult.message,
      status: validationResult.status,
    });
  } else {
    res.json({
      message: validationResult.message,
      status: validationResult.status,
    });
  }
}

async function getFreeRooms(req, res) {
  const validationResult = validateUtil.validateDatesForSearch(
    req.body.startDate,
    req.body.endDate
  );

  if (!validationResult.status) {
    res.json({
      message: validationResult.message,
      status: validationResult.status,
    });
    return;
  }

  const existingBookings = await Booking.lookForBookedRooms(
    req.body.startDate,
    req.body.endDate
  );
  if (!validateUtil.createFreeRoomsList(existingBookings)|| validateUtil.createFreeRoomsList(existingBookings).length === 0) {
    res.json({message:  "სამწუხაროდ თავისუფალი ნომერი ამ დღეებში არ გვაქვს",
    status: 'notFree'});
    return
  }
  res.json(validateUtil.createFreeRoomsList(existingBookings))
}

module.exports = {
  getLanding: getLanding,
  saveBooking: saveBooking,
  getFreeRooms: getFreeRooms,
};
