const express = require('express')
const path = require('path')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));


app.get('/', function(req , res){
    res.render('index')
})


let port = 3000;
if (process.env.PORT) {
  port = process.env.PORT;
}


app.listen(port);
