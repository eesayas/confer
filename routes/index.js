const express = require('express');
const crypto = require('crypto');
const router = express.Router();

/**
@route  GET /
@desc   This will render the index view
*/
router.get('/', (req, res) => {
  res.render('index', { title: 'iSeeYa', video: false});
});

/**
@route  POST /
@desc   This will send a recover unique/room id  
*/
router.post("/", (req, res) => {
  crypto.randomBytes(10, (err, buff) => {
    if(err){
      res.status(400).json({success: false, msg: "Cannot create room ID"});
    } else{
      res.status(200).json({success: true, room_id: buff.toString('hex')})
    }
  });
});

/**
@route  GET /:room_id
@desc   This will render the view for video
*/
router.get('/:room_id', function(req, res, next) {
  res.render('video', 
    { title: 'Video chat in progress...', 
      video: true, 
      room_id: req.params.room_id,
      port: process.env.PORT,
      host: process.env.HOST
    });
});

module.exports = router;