var express = require('express');
var router = express.Router();
var {getAllLocations} = require('../db/mongoCRUD.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('boeberbra/public/index.html', { title: 'Express' });
});

module.exports = router;
