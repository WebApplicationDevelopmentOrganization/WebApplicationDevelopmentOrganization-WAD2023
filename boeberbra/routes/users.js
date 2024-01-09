var express = require('express');
var router = express.Router();
var {getUserByCredentials} = require('../db/mongoCRUD.js');

/* GET users listing. */
router.post('/', async function(req, res, next) {
    try {
        const {username, password} = req.body
        const user = await getUserByCredentials(username, password);
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(401).send("Username or password incorrect.")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error.")
    }
});

module.exports = router;
