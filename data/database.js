const mongoDb = require("mongodb");

const mongoClient = mongoDb.MongoClient;

let database;
let mongodbUrl = 'mongodb://127.0.0.1:27017'

if(process.env.MONGODB_URL){
    mongodbUrl = process.env.MONGODB_URL
}

async function connectToDatabase() {
  const client = await mongoClient.connect(mongodbUrl);
  database = client.db("online-shop");
}

function getDb() {
    if(!database){
        throw new Error('database connection not established');
    }

    return database;
}


module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}