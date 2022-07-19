const express = require("express");
const Booking = require("../models/booking");

const validateUtil = require("../util/validation");

const router = express.Router();

router.get("/", function (req, res) {
  // configs

  res.render("index");
});

router.post("/newbooking", async function (req, res) {
  const booking = new Booking({
    ...req.body,
  });
  if (
    validateUtil.everyThingIsValid(
      req.body.name,
      req.body.source,
      req.body.room,
      req.body.startDate,
      req.body.endDate
    )
  ) {
    booking.save();
    console.log(booking);
    console.log("booking saved");
    res.json({message: "booking saved"})
  } else {
    console.log("something went wrong");
    
  }
});

module.exports = router;
