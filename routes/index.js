const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'iSeeYa' });
});

router.get('/:id', function(req, res, next) {
  res.render('video', { title: 'Video Chat in progress...' });
});

//service. creates meeeting id
router.post('/create-meeting', function(req, res, next){
  crypto.randomBytes(10, (err, buff) => {
    if(err){
      console.log(err);
      res.redirect('/');
    } else{
      res.send(buff.toString('hex'));
    }
  });
});

module.exports = router;