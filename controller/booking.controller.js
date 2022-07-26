const Booking = require("../models/booking.model");

const validateUtil = require("../util/validation");

function getLanding(req, res) {
  res.render("index");
}

async function saveBooking(req, res, next) {
  const booking = new Booking({
    ...req.body,
  });

  const validationResult = validateUtil.everyThingIsValid(
    req.body.name,
    req.body.source,
    req.body.room,
    req.body.startDate,
    req.body.endDate
  );

  let existingBooking;
  try {
    existingBooking = await Booking.RoomIsBooked(
      req.body.room,
      req.body.startDate,
      req.body.endDate
    );
  } catch (error) {
    next(error);
  }

  if (existingBooking.length !== 0) {
    res.json({
      message:
        "გთხოვთ გადაამოწმოთ ნომერი და თარიღი! მოცემულ თარიღებში ნომერი დაჯავშნილია",
      status: false,
    });
    return;
  }

  if (validationResult.status) {
    try {
      await booking.save();
    } catch (error) {
      next(error);
    }
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

async function getFreeRooms(req, res, next) {
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

async function getBookedRooms(req, res, next) {
  // seach if only dates are entered
  const datesValidationResult = validateUtil.validateDatesForSearch(
    req.body.startDate,
    req.body.endDate
  );
  if (!datesValidationResult.status) {
    res.json({
      message: datesValidationResult.message,
      status: datesValidationResult.status,
    });
    return;
  }
  if (datesValidationResult.status && !req.body.room && !req.body.source) {
    let existingBookings;
    try {
      existingBookings = await Booking.lookForBookedRooms(
        req.body.startDate,
        req.body.endDate
      );
    } catch (error) {
      next(error);
    }

    res.json({
      message: datesValidationResult.message,
      status: datesValidationResult.status,
      bookings: existingBookings,
    });
    return;
  }

  // seach if rooom is entered and not source

  if (req.body.room && !req.body.source) {
    const validationResult = validateUtil.roomIsValid(req.body.room, true);
    if (!validationResult.status) {
      res.json({
        message: validationResult.message,
        status: validationResult.status,
      });
      return;
    }

    let existingBooking;
    try {
      existingBooking = await Booking.RoomIsBooked(
        req.body.room,
        req.body.startDate,
        req.body.endDate
      );
    } catch (error) {
      next(error);
    }
    res.json({
      message: validationResult.message,
      status: validationResult.status,
      bookings: existingBooking,
    });
  }

  // search if source is entered and no rooms provided

  if (req.body.source && !req.body.room) {
    let existingBooking;
    try {
      existingBooking = await Booking.searchSourceAndDates(
        req.body.source,
        req.body.startDate,
        req.body.endDate
      );
    } catch (error) {
      next(error);
    }
    res.json({
      message: '',
      status: true,
      bookings: existingBooking
    });
  }

  //search if everything is entered

  if (req.body.source && req.body.room) {
    let existingBooking;
    try {
      existingBooking = await Booking.searchWithRoomAndSource(
        req.body.room,
        req.body.source,
        req.body.startDate,
        req.body.endDate
      );
    } catch (error) {
      next(error);
    }
    res.json({
      message: '',
      status: true,
      bookings: existingBooking
    });
  }
}

async function deleteBooking(req, res, next){
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    await booking.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });
}

module.exports = {
  getLanding: getLanding,
  saveBooking: saveBooking,
  getFreeRooms: getFreeRooms,
  getBookedRooms: getBookedRooms,
  deleteBooking: deleteBooking
};
