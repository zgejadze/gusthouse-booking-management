const express = require("express");

const router = express.Router();
const bookingController = require('../controller/booking.controller')

router.get("/", bookingController.getLanding
);

router.post("/newbooking", bookingController.saveBooking);

router.post("/getFreeRooms", bookingController.getFreeRooms);

router.post('/getBookedRooms', bookingController.getBookedRooms)

router.delete('/bookings/:id', bookingController.deleteBooking)

module.exports = router;
