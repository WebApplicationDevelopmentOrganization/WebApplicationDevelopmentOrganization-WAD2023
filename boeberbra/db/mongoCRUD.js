// include mongodb
const {MongoClient, ObjectId} = require('mongodb');
// include debug
//const {debug} = require('debug')('app:backend');

//export {getUserByName, addUser, getAllLocations, getLocationById, addLocation, updateLocation, deleteLocation};

const db_name = 'wb_application_development_organization_wad_2023';
const db_user = 'superman';
const db_pwd = 'ycKktq8t8';

const URI = "mongodb://" + db_name + "_"+ db_user + ":" + db_pwd + "@mongodb1.f4.htw-berlin.de:27017/" + db_name;

const user_collection = 'users';
const loc_collection = 'locations';

async function getUserByName(name) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const usr = db.collection(user_collection);
        const query = {name: name};
        const doc = await usr.findOne(query);
        console.log(doc);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


async function addUser(name, password, role) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const usr = db.collection(user_collection);
        const doc = {
            name: name,
            pw: password, 
            role: role
        };
        const result = await usr.insertOne(doc);
        console.log(result);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

//addUser('test', 'test', 'admin').catch(console.log);
//getUserByName('test').catch(console.log);



async function getAllLocations() {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        const query = {};
        const doc = await collection.find(query).toArray();

        if (doc.length > 0) {
            console.log(doc);
        } else {
            console.log('No locations found');
        }

        console.log(doc);

        return doc;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function getLocationById(id) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        id = new ObjectId(id);
        const query = {_id: id};
        const doc = await collection.findOne(query);
        console.log(doc);
        return doc;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function addLocation(location) {
    delete location._id;
    delete location.marker;
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        const result = await collection.insertOne(location);
        console.log(result);
        return result;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

const locReinhardtstraße = {
    _id: new ObjectId("65997784c428d268c4974cb9"),
    name: "Foo",
    desc: "Angrenzend der Kronprinzbrücke sorgt der Straßenverkehr für hohe Luftbelastung",
    address: "Reinhardtstraße",
    city: "Berlin",
    zip: "10117", 
    state: "Berlin",
    lat: 52.522092398319806,
    lon: 13.376525533854272,
    severity: 1,
    marker: null
};

//addLocation(locReinhardtstraße).catch(console.log);

async function updateLocation(location) {
    delete location.marker;
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        const query = {_id: location._id};
        const result = await collection.replaceOne(query, location);
        console.log(result);
        return result;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function deleteLocation(id) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        id = new ObjectId(id);
        const query = {_id: id};
        const result = await collection.deleteOne(query);
        console.log(result);
        return result;

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

module.exports = {
    getUserByName,
    addUser,
    getAllLocations,
    getLocationById,
    addLocation,
    updateLocation,
    deleteLocation
};
