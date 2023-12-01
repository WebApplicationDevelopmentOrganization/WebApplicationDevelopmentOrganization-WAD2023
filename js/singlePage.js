import getUserByName from "./users.js";
import { ROLE_ADMIN, ROLE_NORMAL } from "./users.js";
import {locations, addLocationToList, deleteLocation } from "./locations.js";

export {UPDATE_DELETE_SCREEN, hideAllDivsAndShow, addLocationToMap}

const LOGIN_SCREEN = "Login-Screen";
const MAIN_SCREEN = "Main-Screen";
const ADD_SCREEN = "Add-Screen";
const UPDATE_DELETE_SCREEN = "Update/Delete-Screen";

let activeUser = null;
let isUserLoggedIn = false;

const divs = document.querySelectorAll(".visibleDivClass");

function hideAllDivsAndShow(id, args=null) {

    divs.forEach(function(div) {
        if (div.id == id) {
            pageSetUp(id, args);
            div.style.display = "";
        } else {
            div.style.display = "none";
        }
    });
}

function pageSetUp(id, arg=null) {
    switch (id) {
        case LOGIN_SCREEN:
            return;

        case MAIN_SCREEN:
            setUpMainPage();
            return;

        case ADD_SCREEN:
            return;

        case UPDATE_DELETE_SCREEN:
            setUpUpdateDeletePage(arg);
            return;

        default:
            console.warn("Page id does not exist.");
            return;
    }
}

function setUpUpdateDeletePage(location) {
    console.log(location);
    document.getElementById("locationName2").value = location.name;
    document.getElementById("description2").value = location.desc;
    document.getElementById("locationAdress2").value = location.address;
    document.getElementById("city2").value = location.city;
    document.getElementById("zipCode2").value = location.zip;
    document.getElementById("lat2").value = location.lat;
    document.getElementById("lon2").value = location.lon;
    if (location.severity === 1) {
        document.getElementById("updateSeverityLvl1").checked = true;
    } else if (location.severity === 2) {
        document.getElementById("updateSeverityLvl2").checked = true;
    } else {
        document.getElementById("updateSeverityLvl3").checked = true;
    }

    if (location.state === "Brandenburg") {
        document.getElementById("burg2").checked = true;
    } else {
        document.getElementById("ber2").checked = true;
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
    initMap();
    document.getElementById("Login-Form").onsubmit = checkLogin;
    document.getElementById("logoutBtn").onclick = logout;
    document.getElementById("addBtn").onclick = addBtnClicked;
    document.getElementById("cancelBtn").onclick = cancelBtnClicked;
    document.getElementById("cancelBtn2").onclick = cancelBtnClicked;
    document.getElementById("saveBtn").onclick = saveBtnClicked;
    document.getElementById("updateBtn").onclick = updateBtnClicked;
    document.getElementById("deleteBtn").onclick = deleteBtnClicked;
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

    const locationsList = document.getElementById('locations-list');
    const listItem = document.createElement('li');
    listItem.id = location.name + "_li";
    listItem.innerHTML = `<Button id="${location.name} class="hover:text-gray-600" >${location.name}: <br> ${location.address}, <br> ${location.zip} ${location.city} </Button>`;
    listItem.addEventListener('click', () => {
        hideAllDivsAndShow(UPDATE_DELETE_SCREEN, location);
    });
    locationsList.appendChild(listItem);

    let marker = L.marker([location.lat, location.lon]).addTo(map);
    let maker = marker.bindPopup(location.name)
    map.setView([location.lat, location.lon]);
    location.marker = marker;
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

async function saveBtnClicked(e) {
    e.preventDefault();

    let newLocation = {
        name: document.getElementById("locationName").value,
        desc: document.getElementById("description").value,
        address: document.getElementById("locationAdress").value,
        city: document.getElementById("city").value,
        zip: document.getElementById("zipCode").value,
        state: getStateFromRadioBtn(""),
        lat: document.getElementById("lat").value,
        lon: document.getElementById("lon").value,
        severity: getSeverityLevelFromRadioBtn("s")
    }

    if (newLocation.lat === "" || newLocation.lon === "") {
        let locationAvailable = await setCoordinatesByAddress(newLocation);
        if (!locationAvailable) {
            alert("Invalid adress.");
            return;
        }
    }

    addLocationToList(newLocation);
    addLocationToMap(newLocation);

    hideAllDivsAndShow(MAIN_SCREEN);
}

async function setCoordinatesByAddress(newLocation) {
    // add location to map by adress
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${newLocation.address}, ${newLocation.zip} ${newLocation.city}, ${newLocation.state}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        if (data.length == 0) {
            return false;
        }
        newLocation.lat = data[0].lat;
        newLocation.lon = data[0].lon;
        return true;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return false;
    }
}

function getStateFromRadioBtn(action) {
    const berChecked = document.getElementById("ber" + action).checked;
    const burgChecked = document.getElementById("burg" + action).checked;

    return berChecked ? "Berlin" : "Brandenburg";
}

function getSeverityLevelFromRadioBtn(action) {
    const lv1 = document.getElementById(action + "everityLvl1").checked;
    const lv2 = document.getElementById(action + "everityLvl2").checked;
    const lv3 = document.getElementById(action + "everityLvl3").checked;

    return lv1 ? 1 : lv2 ? 2 : 3;
}

async function updateBtnClicked(e) {
    e.preventDefault();

    let newLocation = {
        name: document.getElementById("locationName2").value,
        desc: document.getElementById("description2").value,
        address: document.getElementById("locationAdress2").value,
        city: document.getElementById("city2").value,
        zip: document.getElementById("zipCode2").value,
        state: getStateFromRadioBtn("2"),
        lat: document.getElementById("lat2").value,
        lon: document.getElementById("lon2").value,
        severity: getSeverityLevelFromRadioBtn("updateS")
    }

    if (newLocation.lat === "" || newLocation.lon === "") {
        let locationAvailable = await setCoordinatesByAddress(newLocation);
        if (!locationAvailable) {
            alert("Invalid adress.");
            return;
        }
    }

    // delete old  location


}

function deleteBtnClicked(e) {
    e.preventDefault();
    let locationName = document.getElementById("locationName2").value;
    let locationsList = document.getElementById("locations-list");
    let location = locations.find(location => location.name === locationName);
    deleteLocation(location);
    const listItemToRemove = document.getElementById(location.name + "_li");
    if (listItemToRemove) {
        locationsList.removeChild(listItemToRemove);
    } else {
        console.log("Element nicht gefunden");
    }
    let marker = location.marker;
    map.removeLayer(marker);
    hideAllDivsAndShow(MAIN_SCREEN);
}