var express = require('express');
var router = express.Router();

router.get('/post?', async function(req, res, next) {
    const locations = await getAllLocations();
        
    // Now send the response with the retrieved locations
    res.json(locations);
  });


module.exports = router;
