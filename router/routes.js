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
  const validationResult = validateUtil.everyThingIsValid(
    req.body.name,
    req.body.source,
    req.body.room,
    req.body.startDate,
    req.body.endDate
  )
  if (
    validationResult.status
  ) {
    await booking.save();
    console.log("booking saved");
    res.status(201).json({message: validationResult.message,  status: validationResult.status})
  } else {
    
    res.json({message: validationResult.message,  status: validationResult.status})
  }
});

module.exports = router;
