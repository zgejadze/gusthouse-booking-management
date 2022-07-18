const express = require('express')
const path = require('path')
const db = require('./data/database');

const app = express();
const baseRoutes = require('./router/routes')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(baseRoutes)


let port = 3000;
if (process.env.PORT) {
  port = process.env.PORT;
}


db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });

