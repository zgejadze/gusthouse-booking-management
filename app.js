const express = require('express')
const path = require('path')

const app = express();
const baseRoutes = require('./router/routes')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));


app.use(baseRoutes)


let port = 3000;
if (process.env.PORT) {
  port = process.env.PORT;
}


app.listen(port);
