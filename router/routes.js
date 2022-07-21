const express = require("express");

const router = express.Router();
const bookingController = require('../controller/booking.controller')

router.get("/", bookingController.getLanding
);

router.post("/newbooking", bookingController.saveBooking);

router.post("/getFreeRooms", bookingController.getFreeRooms);

module.exports = router;
