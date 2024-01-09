const {MongoClient, ObjectId} = require('mongodb');

const db_name = 'wb_application_development_organization_wad_2023';
const db_user = 'superman';
const db_pwd = 'ycKktq8t8';

const URI = "mongodb://" + db_name + "_"+ db_user + ":" + db_pwd + "@mongodb1.f4.htw-berlin.de:27017/" + db_name;

const user_collection = 'users';
const loc_collection = 'locations';

async function getUserByCredentials(username, password) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const usr = db.collection(user_collection);
        const query = {username: username, password: password};
        const user = await usr.findOne(query);
        if (user) {
            delete user.password
        }
        return user

    } finally {
        await client.close();
    }
}

async function addUser(username, password, firstname, role) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const usr = db.collection(user_collection);
        const doc = {
            username: username,
            password: password, 
            firstname: firstname,
            role: role
        };
        const result = await usr.insertOne(doc);

    } finally {
        await client.close();
    }
}

async function getAllLocations() {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        const query = {};
        const doc = await collection.find(query).toArray();
        return doc;

    } finally {
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
        return doc;
    } finally {
        await client.close();
    }
}

async function addLocation(location) {
    delete location._id;
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        const result = await collection.insertOne(location);
        return result;

    } finally {
        await client.close();
    }
}

async function updateLocation(location) {
    const client = new MongoClient(URI);
    try {
        const db = client.db(db_name);
        const collection = db.collection(loc_collection);
        let id = new ObjectId(location._id)
        const query = {_id: id};
        const result = await collection.replaceOne(query, location);
        return result;

    } finally {
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
        return result;

    } finally {
        await client.close();
    }
}

module.exports = {
    getUserByCredentials,
    addUser,
    getAllLocations,
    getLocationById,
    addLocation,
    updateLocation,
    deleteLocation
};
