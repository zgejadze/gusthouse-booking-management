const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

let mongodbUri = "mongodb://127.0.0.1:27017";

if (process.env.MONGODB_URL) {
  mongodbUri = process.env.MONGODB_URL;
}

function createSessionStore(session) {
  const MongoDbStore = mongoDbStore(expressSession);

  const store = new MongoDbStore({
    uri: mongodbUri,
    databaseName: "guesthouse",
    collection: "sessions",
  });
  return store;
}

function createSessionConfig() {
  return {
    secret: "more-random-string",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
  };
}

module.exports = createSessionConfig;
