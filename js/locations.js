

const locReinhardtstraße = {
    name: "Reinhardtstraße",
    desc: "Angrenzend der Kronprinzbrücke sorgt der Straßenverkehr für hohe Luftbelastung",
    address: "Reinhardtstraße",
    city: "Berlin",
    zip: "10117", 
    state: "Berlin",
    lat: 52.51869218853665,
    lon: 13.376147888081254,
    severity: 3
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
    const locationsList = document.getElementById('locations-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${location.name}: <br> ${location.address}, <br> ${location.zip} ${location.city}`;
    locationsList.appendChild(listItem);
}

// a list with all locations
const locations = [locReinhardtstraße, locHKWMoabit, locTeslaGF];

export { locations, addLocationToList };

