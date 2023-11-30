import getUserByName from "./users.js";
import { ROLE_ADMIN, ROLE_NORMAL } from "./users.js";
import {locations, addLocationToList } from "./locations.js";

const LOGIN_SCREEN = "Login-Screen";
const MAIN_SCREEN = "Main-Screen";
const ADD_SCREEN = "Add-Screen";
const UPDATE_DELETE_SCREEN = "Update/Delete-Screen";

let activeUser = null;
let isUserLoggedIn = false;

const divs = document.querySelectorAll(".visibleDivClass");

function hideAllDivsAndShow(id) {

    divs.forEach(function(div) {
        if (div.id == id) {
            pageSetUp(id);
            div.style.display = "";
        } else {
            div.style.display = "none";
        }
    });
}

function pageSetUp(id) {
    switch (id) {
        case LOGIN_SCREEN:
            return;

        case MAIN_SCREEN:
            setUpMainPage();
            return;

        case ADD_SCREEN:
            return;

        case UPDATE_DELETE_SCREEN:
            return;

        default:
            console.warn("Page id does not exist.");
            return;
    }
}

function setUpMainPage() {
    let addBtn = document.getElementById("addBtn");

    if (activeUser.role !== ROLE_ADMIN) {
        addBtn.style.display = "none";
    } else {
        addBtn.style = "";
    }

    document.getElementById("usernameWelcomeMessage").innerText = activeUser.username;
}

window.addEventListener('load', function() {
    hideAllDivsAndShow(LOGIN_SCREEN);
});

document.addEventListener("DOMContentLoaded", function() {
    // add all locations to the list
    locations.forEach(addLocationToList);
    initMap();
    document.getElementById("Login-Form").onsubmit = checkLogin;
    document.getElementById("logoutBtn").onclick = logout;
    document.getElementById("addBtn").onclick = addBtnClicked;
    document.getElementById("cancelBtn").onclick = cancelBtnClicked;
    document.getElementById("saveBtn").onclick = saveBtnClicked;
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
    let marker = L.marker([location.lat, location.lon]).addTo(map);
    marker.bindPopup(location.name)
    map.setView([location.lat, location.lon]);
}

function checkLogin(e) {
    e.preventDefault();

    const usernameEntered = document.getElementById("username").value;
    const passwordEntered = document.getElementById("password").value;

    let user = getUserByName(usernameEntered);

    if (user === null) {
        alert("Incorrect username or password!");
        isUserLoggedIn = false;
        return;
    }

    let loginCredentialsCorrect = user.password === passwordEntered;

    if (!loginCredentialsCorrect) {
        alert("Incorrect username or password!");
        isUserLoggedIn = false;
        return;
    }

    activeUser = user;
    isUserLoggedIn = true;

    hideAllDivsAndShow(MAIN_SCREEN);
}

function logout() {
    activeUser = null;
    isUserLoggedIn = false;

    hideAllDivsAndShow(LOGIN_SCREEN);
}

function addBtnClicked() {
    hideAllDivsAndShow(ADD_SCREEN);
}

function cancelBtnClicked() {
    hideAllDivsAndShow(MAIN_SCREEN);
}

function saveBtnClicked(e) {
    e.preventDefault();

    let newLocation = {
        name: document.getElementById("locationName").value,
        desc: document.getElementById("description").value,
        address: document.getElementById("locationAdress").value,
        city: document.getElementById("city").value,
        zip: document.getElementById("zipCode").value,
        state: getStateFromRadioBtn(),
        lat: document.getElementById("lat").value,
        lon: document.getElementById("lon").value,
        severity: getSeverityLevelFromRadioBtn()
    }

    if (newLocation.lat === "" || newLocation.lon === "") {
        // add location to map by adress
        let addressUnavailable = false;

        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${newLocation.address}, ${newLocation.zip} ${newLocation.city}, ${newLocation.state}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    addressUnavailable = true;
                    return;
                }

                newLocation.lat = data[0].lat;
                newLocation.lon = data[0].lon;
            });

        if (addressUnavailable) {
            alert("Invalid adress.");
            return;
        }
    }

    addLocationToList(newLocation);
    addLocationToMap(newLocation);

    hideAllDivsAndShow(MAIN_SCREEN);
}

function getStateFromRadioBtn() {
    const berChecked = document.getElementById("ber").checked;
    const burgChecked = document.getElementById("burg").checked;

    return berChecked ? "Berlin" : "Brandenburg";
}

function getSeverityLevelFromRadioBtn() {
    const lv1 = document.getElementById("severityLvl1").checked;
    const lv2 = document.getElementById("severityLvl2").checked;
    const lv3 = document.getElementById("severityLvl3").checked;

    return lv1 ? 1 : lv2 ? 2 : 3;
}