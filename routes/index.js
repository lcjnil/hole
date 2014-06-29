var express = require('express');
var router = express.Router();
var daylight = require('daylight');
var entities = require("entities");

var Wish = require('../model/wish.js').Wish;

/* GET home page. */
router.get('/', function(req, res) {
  //GET COOKIE
  if (!req.session.token) {
    req.session.token = randomString(8);
  }
  Wish.count({}, function(err, cnt){
    var page = {};
    page.now = req.query.p ? parseInt(req.query.p) : 1;
    page.end = Math.ceil(cnt / 30);
    console.log(page);

    Wish.find().sort({'id':-1}).skip((req.query.p-1)*30).limit(30).exec(function(err, wishes){
      wishes.forEach(function(wish, index) {
        if(!Array.isArray(wish.likes)) {
          wish.likes=[];
        }
        if(!Array.isArray(wish.dislikes)) {
          wish.dislikes=[];
        }
        wishes[index].timeS = daylight('m/d H:i', wish.time);
        wish.content = wish.content.replace(/\r\n/g,'</br>');
        wishes[index].content = showEmoji(wishes[index].content);
      })

      res.render('index', {
        title: '网络工程树洞',
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        user: req.session.token,
        wishes: wishes.reverse(),
        page: page,
        test: false
      });
    })
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
      if (err) {
        req.flash('error', '数据库异常！');
        return res.redirect('back');
      }
      req.flash('success', '您的秘密已经投递～');
      res.redirect('back');
    })
  })
})

//LIKES
router.post('/likes', function(req, res){
  if (req.body.like) {
    Wish.findOne({id: req.body.like}, function(err, oneWish) {
      oneWish.likes.push(req.session.token);
      oneWish.save(function(err) {
        //req.flash('success', '点赞成功');
        res.redirect('back');
      })
    })
  }
  if (req.body.clearLike) {
    Wish.findOne({id: req.body.clearLike}, function(err, oneWish) {
      oneWish.likes.splice(oneWish.likes.indexOf(req.session.token), 1);
      oneWish.save(function(err) {
        //req.flash('success', '取消点赞成功');
        res.redirect('back');
      })
    })
  }
  if (req.body.dislike) {
    Wish.findOne({id: req.body.dislike}, function(err, oneWish) {
      oneWish.dislikes.push(req.session.token);
      oneWish.save(function(err) {
        res.redirect('back');
      })
    })
  }
  if (req.body.clearDislike) {
    Wish.findOne({id: req.body.clearDislike}, function(err, oneWish) {
      oneWish.dislikes.splice(oneWish.dislikes.indexOf(req.session.token), 1);
      oneWish.save(function(err) {
        res.redirect('back');
      })
    })
  }
})
router.get('/YWRtaW4=', function(req, res) {
  Wish.find('', function(err, wishes) {
    wishes.forEach(function(wish, index) {
      wishes[index].timeS = daylight('m/d H:i', wish.time);
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




function randomString(length) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

  if (! length) {
    length = Math.floor(Math.random() * chars.length);
  }

  var str = '';
  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

function showEmoji(content) {
  var dom;
  reg = /\[emoji:\w+\]/g;
  matchArray = content.match(reg);
  if (matchArray==null) return content;
  matchArray.forEach(function(eachMatch) {
    dom = eachMatch.toString()
    dom = dom.substr(1, eachMatch.length-2);
    dom = dom.replace(':', '');
    dom = '<span class="emoji ' + dom +'"></span>';
    content = content.replace(eachMatch, dom)
  })
  return content;
}


String.prototype.replaceAll = function (findText, repText){
  var newRegExp = new RegExp(findText, 'gm');
  return this.replace(newRegExp, repText);
}