const express = require('express')

const router = express.Router()

router.get('/', function (req, res){
    // configs 
    

    res.render('index')
})

module.exports = router