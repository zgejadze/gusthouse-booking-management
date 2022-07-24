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

  const existingBooking = await Booking.RoomIsBooked(
    req.body.room,
    req.body.startDate,
    req.body.endDate
  );


  if(existingBooking.length !== 0){
    res.json({
      message: "გთხოვთ გადაამოწმოთ ნომერი და თარიღი! მოცემულ თარიღებში ნომერი დაჯავშნილია",
      status: false,
    });
    return
  };

  if (validationResult.status) {
    try {
      await booking.save();
    } catch (error) {
      next(error);
    }
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

  let existingBookings;
  try {
     existingBookings = await Booking.lookForBookedRooms(
      req.body.startDate,
      req.body.endDate
    );
  } catch (error) {
    next(error);
  }
  if (
    !validateUtil.createFreeRoomsList(existingBookings) ||
    validateUtil.createFreeRoomsList(existingBookings).length === 0
  ) {
    res.json({
      message: "სამწუხაროდ თავისუფალი ნომერი ამ დღეებში არ გვაქვს",
      status: "notFree",
    });
    return;
  }
  res.json(validateUtil.createFreeRoomsList(existingBookings));
}

module.exports = {
  getLanding: getLanding,
  saveBooking: saveBooking,
  getFreeRooms: getFreeRooms,
};
