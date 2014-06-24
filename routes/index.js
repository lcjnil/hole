var express = require('express');
var router = express.Router();
var Wish = require('../model/wish.js').Wish;

/* GET home page. */
router.get('/', function(req, res) {
  Wish.find('', function(err, wishes) {
    res.render('index', {
      title: '网络工程树洞',
      wishes: wishes
      });
  })

});

router.post('/', function(req, res) {
  var wish = new Wish({
    to: req.body.to,
    from: req.body.from,
    content: req.body.content
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

module.exports = router;
