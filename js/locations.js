export { locations, addLocationToList, deleteLocation};
import { hideAllDivsAndShow, UPDATE_DELETE_SCREEN, addLocationToMap } from "./singlePage.js";

const templateLocation = {
    name: null,
    desc: null,
    address: null,
    city: null,
    zip: null,
    state: null,
    lat: 0.0,
    lon: 0.0,
    severity: 0
}

const locReinhardtstraße = {
    name: "Reinhardtstraße",
    desc: "Angrenzend der Kronprinzbrücke sorgt der Straßenverkehr für hohe Luftbelastung",
    address: "Reinhardtstraße",
    city: "Berlin",
    zip: "10117", 
    state: "Berlin",
    lat: 52.51869218853665,
    lon: 13.376147888081254,
    severity: 1
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
    severity: 3
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
    severity: 3
}

function addLocationToList(location) {
    locations.push(location);
}

function deleteLocation(itemToRemove) {
    console.log("before delete")
    //console.log(locations);
    for (let location of locations) {
        console.log(location);
    }
    let index = locations.indexOf(itemToRemove);
    locations.splice(index, 1);
    console.log("after delete");
    //console.log(locations);
    for (let location of locations) {
        console.log(location);
    }
}

// a list with all locations
let locations = [locReinhardtstraße, locHKWMoabit, locTeslaGF];