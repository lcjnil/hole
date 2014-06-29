var express = require('express');
var router = express.Router();
var daylight = require('daylight');
var entities = require("entities");

var Wish = require('../model/test.js').Wish;

/* GET home page. */
router.get('/', function(req, res) {
  Wish.find('', function(err, wishes) {
    wishes.forEach(function(wish, index) {
      wishes[index].timeS = daylight('Y-m-d H:i', wish.time);

    })

    res.render('index', {
      title: '网络工程树洞',
      wishes: wishes,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      test: true
    });
  })

});

router.post('/', function(req, res) {
  Wish.count('', function(err, cnt) {
    var wish = new Wish({
      to: req.body.to,
      from: req.body.from,
      content: req.body.content.replaceAll('<', '&lt;'),
      id: cnt+1
    });
    if (req.body.from == "") {
      wish.from ="Anonymous";
    }
    if (req.body.to == "") {
      wish.to ="Everyone";
    }
    wish.save(function(err) {
      res.redirect('back');
    })
  })
})


router.get('/YWRtaW4=', function(req, res) {
  Wish.find('', function(err, wishes) {
    wishes.forEach(function(wish, index) {
      wishes[index].timeS = daylight('Y-m-d H:i', wish.time);
    })

    res.render('admin', {
      title: '网络工程树洞-管理界面',
      wishes: wishes
    });
  })
})

router.post('/YWRtaW4=', function(req, res) {
  if (req.body.deleteId) {
    Wish.findOne({id: req.body.deleteId}, function(err, oneWish) {
      if (err) {
        res.render('error', {
          message: err.message,
          error: err
        });
      }
      oneWish.visible = false;
      oneWish.save(function(err) {
        res.redirect('back');
      })
    })
  }
  else if (req.body.restartId) {
    Wish.findOne({id: req.body.restartId}, function(err, oneWish) {
      if (err) {
        res.render('error', {
          message: err.message,
          error: err
        });
      }
      oneWish.visible = true;
      oneWish.save(function(err) {
        res.redirect('back');
      })
    })
  }
})
module.exports = router;


String.prototype.replaceAll = function (findText, repText){
  var newRegExp = new RegExp(findText, 'gm');
  return this.replace(newRegExp, repText);
}