const express = require('express')
const Booking = require('../models/booking')

const router = express.Router()

router.get('/', function (req, res){
    // configs 
    

    res.render('index')
})

router.post('/newbooking',async function(req, res){
    const booking = new Booking ({
        ...req.body
    })
    booking.save()
    res.redirect('/')
})

module.exports = router