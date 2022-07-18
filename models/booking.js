const mongodb = require("mongodb");
const db = require("../data/database");

class Booking {
  constructor(bokingData) {
    this.name = bokingData["booking-name"];
    this.source = bokingData["booking-source"];
    this.room = bokingData["room-number"];
    this.startDate = bokingData["date-start"];
    this.endDate = bokingData["date-end"];
  }

  async save() {
    const bookingData = {
      name: this.name,
      source: this.source,
      room: this.room,
      startDate: this.startDate,
      endDate: this.endDate
    };

    await db.getDb().collection('bookings').insertOne(bookingData)
  }
}

module.exports = Booking
