export { getLocations, addLocationToList, removeLocationFromList };
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
    lat: 52.522092398319806,
    lon: 13.376525533854272,
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

const LOCATIONS_LIST = "locationsList";

function addLocationToList(location) {
    locations.push(location);

    const locationsList = document.getElementById(LOCATIONS_LIST);
    const listItem = document.createElement('li');
    listItem.id = location.name + "_li";
    listItem.innerHTML = `<Button id="${location.name} class="hover:text-gray-600" >${location.name}: <br> ${location.address}, <br> ${location.zip} ${location.city} </Button>`;
    listItem.addEventListener('click', () => {
        hideAllDivsAndShow(UPDATE_DELETE_SCREEN, location);
    });
    locationsList.appendChild(listItem);
}

let locations = [locReinhardtstraße, locHKWMoabit, locTeslaGF];

function removeLocationFromList(location) {
    let index = locations.indexOf(location);
    locations.splice(index, 1);

    const locationsList = document.getElementById(LOCATIONS_LIST);
    const listItemToRemove = document.getElementById(location.name + "_li");
    if (listItemToRemove) {
        locationsList.removeChild(listItemToRemove);
    } else {
        console.warn(`Element \"${location.name}\_li" not found.`);
    }
}

function getLocations() {
    return locations;
}