import getUserByName from "./users.js";
import { locReinhardtstraße, locHKWMoabit, locTeslaGF } from "./locations.js";

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
    initMap();
    document.getElementById('Login-Form').onsubmit = checkLogin;
});

function initMap() {
    let map = L.map('map').setView([52.51999807860289, 13.404877357255282], 12.25);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker1 = L.marker([locReinhardtstraße.lat, locReinhardtstraße.lon]).addTo(map);
    marker1.bindPopup(locReinhardtstraße.name)

    let marker2 = L.marker([locHKWMoabit.lat, locHKWMoabit.lon]).addTo(map);
    marker2.bindPopup(locHKWMoabit.name)

    let marker3 = L.marker([locTeslaGF.lat, locTeslaGF.lon]).addTo(map);
    marker3.bindPopup(locTeslaGF.name)
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