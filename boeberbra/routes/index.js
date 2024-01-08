var express = require('express');
var router = express.Router();
var {getAllLocations} = require('../db/mongoCRUD.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('boeberbra/public/index.html', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.render('boeberbra/public/index.html', { title: 'Express' });
});

router.get('/locations', async function(req, res, next) {
  const locations = await getAllLocations();
      
  // Now send the response with the retrieved locations
  res.json(locations);
});

module.exports = router;
