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
    severity: 0,
    marker: null
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
    severity: 1,
    marker: null
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
    marker: null
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
    marker: null
}

function addLocationToList(location) {
    locations.push(location);
}

function deleteLocation(itemToRemove) {
    let index = locations.indexOf(itemToRemove);
    locations.splice(index, 1);
}

// a list with all locations
let locations = [locReinhardtstraße, locHKWMoabit, locTeslaGF];