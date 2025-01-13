const express = require('express')
const router = express.Router()

router.get('/' , (req, res) => {
    res.json('welcome to home page ! !')
})

router.get('/about' , (req, res) => {
    res.json('welcome to about spage!:)s')
})
 
module.exports = router
