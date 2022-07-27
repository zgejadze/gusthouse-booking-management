const mongodb = require("mongodb");
const db = require("../data/database");

class Booking {
  constructor(bookingData) {
    this.name = bookingData.name;
    this.source = bookingData.source;
    this.room = bookingData.room;
    this.startDate = new Date(bookingData.startDate);
    this.endDate = new Date(bookingData.endDate);
    if (bookingData._id) {
      this.id = bookingData._id.toString();
    }
  }

  async save() {
    const bookingData = {
      name: this.name,
      source: this.source,
      room: this.room,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    if (this.id) {
      const bookingId = new mongodb.ObjectId(this.id);
      await db.getDb().collection("bookings").updateOne(
        { _id: bookingId },
        {
          $set: bookingData,
        }
      );
    } else {
      await db.getDb().collection("bookings").insertOne(bookingData);
    }
  }

  static async findById(bookingId) {
    let bookId;
    let booking;
    try {
      bookId = new mongodb.ObjectId(bookingId);
      booking = await db
        .getDb()
        .collection("bookings")
        .findOne({ _id: bookId });
    } catch (error) {
      error.code = 404;
      throw error;
    }

    if (!booking) {
      const error = new Error("Could not find booking with provided id.");
      error.code = 404;
      throw error;
    }

    return new Booking(booking);
  }

  remove() {
    const bookingId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("bookings").deleteOne({ _id: bookingId });
  }

  static async lookForBookedRooms(bookingStarts, bookingEnds) {
    const startDate = new Date(bookingStarts);
    const endDate = new Date(bookingEnds);

    const query = {
      $or: [
        {
          startDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          endDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
        },
      ],
    };

    const result = await db
      .getDb()
      .collection("bookings")
      .find(query)
      .toArray();
    return result.map(function (result) {
      return new Booking(result);
    });
  }

  static async RoomIsBooked(room, bookingStarts, bookingEnds, id = false) {
    const startDate = new Date(bookingStarts);
    const endDate = new Date(bookingEnds);
    let query = {
      room: room,
      $or: [
        {
          startDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          endDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
        },
      ],
    };

    if (id) {
      const curretBookingId = new mongodb.ObjectId(id);

      query = {
        _id: { $ne: curretBookingId },
        room: room,
        $or: [
          {
            startDate: {
              $gt: startDate,
              $lt: endDate,
            },
          },
          {
            endDate: {
              $gt: startDate,
              $lt: endDate,
            },
          },
          {
            startDate: { $lte: startDate },
            endDate: { $gte: endDate },
          },
        ],
      };
    }

    try {
      const result = await db
        .getDb()
        .collection("bookings")
        .find(query)
        .toArray();
      return result.map(function (result) {
        return new Booking(result);
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchSourceAndDates(source, bookingStarts, bookingEnds) {
    const startDate = new Date(bookingStarts);
    const endDate = new Date(bookingEnds);
    const query = {
      source: source,
      $or: [
        {
          startDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          endDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
        },
      ],
    };
    try {
      const result = await db
        .getDb()
        .collection("bookings")
        .find(query)
        .toArray();
      return result.map(function (result) {
        return new Booking(result);
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchWithRoomAndSource(
    room,
    source,
    bookingStarts,
    bookingEnds
  ) {
    const startDate = new Date(bookingStarts);
    const endDate = new Date(bookingEnds);
    const query = {
      source: source,
      room: room,
      $or: [
        {
          startDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          endDate: {
            $gt: startDate,
            $lt: endDate,
          },
        },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
        },
      ],
    };
    try {
      const result = await db
        .getDb()
        .collection("bookings")
        .find(query)
        .toArray();
      return result.map(function (result) {
        return new Booking(result);
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Booking;
