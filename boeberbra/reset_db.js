const { MongoClient } = require('mongodb');
const { addUser, addLocation } = require('./db/mongoCRUD');


const db_name = 'wb_application_development_organization_wad_2023';
const db_user = 'superman';
const db_pwd = 'ycKktq8t8';

const uri = "mongodb://" + db_name + "_"+ db_user + ":" + db_pwd + "@mongodb1.f4.htw-berlin.de:27017/" + db_name;
const client = new MongoClient(uri);

const databseName = 'wb_application_development_organization_wad_2023';


const locReinhardtstraße = {
    name: "Reinhardtstraße",
    desc: "Angrenzend der Kronprinzbrücke sorgt der Straßenverkehr für hohe Luftbelastung",
    address: "Reinhardtstraße",
    city: "Berlin",
    zip: "10117", 
    state: "Berlin",
    lat: 52.522092398319806,
    lon: 13.376525533854272,
    severity: 1,
};

const locHKWMoabit = {
    name: "Heizkraftwerk Moabit",
    desc: "Ein umweltschädliches HKW",
    address: "Friedrich-Krause-Ufer 10",
    city: "Berlin",
    zip: "13353", 
    state: "Berlin",
    lat: 52.5380092,
    lon: 13.3445253,
    severity: 3,
}

const locTeslaGF = {
    name: "Tesla Gigafactory",
    desc: "Teslas neueste Produktionsstelle, welche den Wald und Luft zerstör",
    address: "Tesla Straße 1",
    city: "Grünheide (Mark)",
    zip: "15537", 
    state: "Brandenburg",
    lat: 52.3932851,
    lon: 13.7875301,
    severity: 3,
}


async function deleteAllCollections() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(databseName);

        // List all collection names in the database
        const collections = await database.listCollections().toArray();

        // Drop each collection in the database
        for (const collection of collections) {
        await database.collection(collection.name).drop();
        console.log(`Collection "${collection.name}" deleted successfully.`);
        }

        console.log(`All collections in the database "${databseName}" have been deleted.`);
    } catch (error) {
        console.error('Error deleting collections:', error);
    } finally {
        await client.close();
    }
}

async function addDefaultValues() {
    console.log("Adding values...")
    await addLocation(locReinhardtstraße)
    await addLocation(locHKWMoabit)
    await addLocation(locTeslaGF)
    await addUser("admina", "password", "Mina", "admin")
    await addUser("normalo", "password", "Norman", "non-admin")
    console.log("Values added.")
}


//deleteAllCollections();
addDefaultValues();