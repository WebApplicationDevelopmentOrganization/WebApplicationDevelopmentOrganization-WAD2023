var express = require('express');
var router = express.Router();
var {addLocation, getAllLocations, getLocationById, updateLocation, deleteLocation} = require('../db/mongoCRUD.js');

router.post('/', async function(req, res, next) {
    try {
        const location = req.body;
        let result = await addLocation(location);
        if (result.acknowledged) {
            let locUri = '/loc/' + result.insertedId;
            res.header('Location', locUri);
            console.log(res.getHeader('Location'))
            res.status(201).send();
        } else {
            res.status(400).send("Location could not be added.");
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error.");
    }
});

router.get('/', async function(req, res, next) {
    try {
        const locations = await getAllLocations();
        locations.forEach(x => x._id = x._id.toString());
        res.status(200).header('Content-Type: application/json').json(locations);

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error.")
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let location = await getLocationById(id);
        if (location) {
            location._id = location._id.toString();
            res.status(200).header('Content-Type: application/json').json(location);
        } else {
            res.status(404).send("Location not found.");
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error.");
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        const location = req.body
        location._id = req.params.id
        let result = await updateLocation(location)
        if (result.modifiedCount == 1) {
            res.status(204).send()
        } else if (result.modifiedCount < 1) {
            res.status(404).send("Location not found.")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal server error.")
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        let result = await deleteLocation(id)
        if (result.deletedCount == 1) {
            res.status(204).send()
        } else if (result.modifiedCount < 1) {
            res.status(404).send("Location not found.")
        }
    } catch (error) {
        res.status(500).send("Internal server error.")
    }
});

module.exports = router;
