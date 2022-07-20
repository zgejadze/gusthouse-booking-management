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
    ...req.body
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
    await booking.save();
    console.log("booking saved");
    res.status(201).json({ message: "booking saved" });
  } else {
    console.log("something went wrong");
    res.status(403).json({message:'something is wrong with inputs'})
  }
});

module.exports = router;
