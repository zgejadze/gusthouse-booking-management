const mongodb = require("mongodb");
const db = require("../data/database");

class Booking {
  constructor(bokingData) {
    this.name = bokingData.name;
    this.source = bokingData.source;
    this.room = bokingData.room;
    this.startDate = new Date(bokingData.startDate);
    this.endDate = new Date(bokingData.endDate);
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
