import getUserByName from "./users.js";
import {locations, addLocationToList} from "./locations.js";

let activeUser = null;
let isUserLoggedIn = false;

function hideAllDivsAndShow(id) {
    const divs = document.querySelectorAll('.visibleDivClass');

    divs.forEach(function(div) {
        if (div.id == id) {
            div.style.display = '';
        } else {
            div.style.display = 'none';
        }
    });
}

window.addEventListener('load', function() {
    hideAllDivsAndShow('Login-Screen');
});


document.addEventListener('DOMContentLoaded', function() {
    // add all locations to the list
    locations.forEach(addLocationToList);
    initMap();
    document.getElementById('Login-Form').onsubmit = checkLogin;
});

let map;

function initMap() {
    map = L.map('map').setView([52.51999807860289, 13.404877357255282], 12.25);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    locations.forEach(addLocationToMap);
}

function addLocationToMap(location) {
    if (location.lat == null || location.lon == null) {
        // add location to map by adress
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${location.address}, ${location.zip} ${location.city}, ${location.state}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                location.lat = data[0].lat;
                location.lon = data[0].lon;
                let marker = L.marker([location.lat, location.lon]).addTo(map);
                marker.bindPopup(location.name)
            });
    }
    else {
        let marker = L.marker([location.lat, location.lon]).addTo(map);
        marker.bindPopup(location.name)
    }
}

function checkLogin(e) {
    e.preventDefault();

    const usernameEntered = document.getElementById("username").value;
    const passwordEntered = document.getElementById("password").value;

    let user = getUserByName(usernameEntered)

    let loginCredentialsCorrect = user.username === usernameEntered
        && user.password === passwordEntered;

    if (!loginCredentialsCorrect) {
        alert("Incorrect username or password!");
        isUserLoggedIn = false;
        return;
    }

    activeUser = user;
    isUserLoggedIn = true;

    hideAllDivsAndShow("Main-Screen");
}