import getUserByName from "./users.js";
import { ROLE_ADMIN, ROLE_NORMAL } from "./users.js";
import { addLocationToList, removeLocationFromList, getLocations } from "./locations.js";

export {UPDATE_DELETE_SCREEN, hideAllDivsAndShow, addLocationToMap}

const LOGIN_SCREEN = "loginScreen";
const MAIN_SCREEN = "mainScreen";
const ADD_SCREEN = "addScreen";
const UPDATE_DELETE_SCREEN = "updateDeleteScreen";

let activeUser = null;
let isUserLoggedIn = false;
let inspectedLocation = null;

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

function disableChildren(parent, isDisabled) {
    let children = parent.children;

    if (children.length == 0) {
        return;
    }

    for (let i = 0; i < children.length; i++) {
        disableChildren(children[i], isDisabled);
        children[i].disabled = isDisabled;
    }
}

function setUpUpdateDeletePage(location) {
    let form = document.getElementById("updateDeleteForm");
    let updateBtn = document.getElementById("updateBtn");
    let deleteBtn = document.getElementById("deleteBtn");

    if (activeUser.role !== ROLE_ADMIN) {
        disableChildren(form, true);
        let cancelBtn = document.getElementById("updateCancelBtn");
        cancelBtn.disabled = false;
        disableChildren(cancelBtn, false);

        updateBtn.style.display = "none";
        deleteBtn.style.display = "none";

    } else {
        disableChildren(form, false)

        updateBtn.style.display = "";
        deleteBtn.style.display = "";
    }

    document.getElementById("updateLocationName").value = location.name;
    document.getElementById("updateDescription").value = location.desc;
    document.getElementById("updateLocationAdress").value = location.address;
    document.getElementById("updateCity").value = location.city;
    document.getElementById("updateZipCode").value = location.zip;
    document.getElementById("updateLat").value = location.lat;
    document.getElementById("updateLon").value = location.lon;
    if (location.severity === 1) {
        document.getElementById("updateSeverityLvl1").checked = true;
    } else if (location.severity === 2) {
        document.getElementById("updateSeverityLvl2").checked = true;
    } else {
        document.getElementById("updateSeverityLvl3").checked = true;
    }

    if (location.state === "Brandenburg") {
        document.getElementById("updateBurg").checked = true;
    } else {
        document.getElementById("updateBer").checked = true;
    }

    inspectedLocation = location;
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
    document.getElementById("loginForm").onsubmit = checkLogin;
    document.getElementById("logoutBtn").onclick = logout;
    document.getElementById("addBtn").onclick = addBtnClicked;
    document.getElementById("cancelBtn").onclick = cancelBtnClicked;
    document.getElementById("updateCancelBtn").onclick = cancelBtnClicked;
    document.getElementById("addForm").onsubmit = saveBtnClicked;
    document.getElementById("updateDeleteForm").onsubmit = updateBtnClicked;
    document.getElementById("deleteBtn").onclick = deleteBtnClicked;
});

let map;

function initMap() {
    map = L.map('map').setView([52.51999807860289, 13.404877357255282], 12.25);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    getLocations().forEach(addLocation);

}

function addLocation(location) {
    addLocationToList(location);
    addLocationToMap(location);
}

function removeLocation(location) {
    removeLocationFromList(location);
    removeLocationFromMap(location);

}

function removeLocationFromMap(location) {
    let marker = location.marker;
    map.removeLayer(marker);
}

function addLocationToMap(location) {
    let marker = L.marker([location.lat, location.lon]).addTo(map);
    marker.bindPopup(location.name);
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
        state: getStateFromRadioBtn("ber", "burg"),
        severity: getSeverityLevelFromRadioBtn("severityLvl1", "severityLvl2", "severityLvl3")
    }

    let locationAvailable = await setCoordinatesByAddress(newLocation);
    if (!locationAvailable) {
        alert("Invalid adress.");
        return;
    }

    addLocation(newLocation);
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

function getStateFromRadioBtn(idBerBtn, idBurgBtn) {
    const berChecked = document.getElementById(idBerBtn).checked;
    const burgChecked = document.getElementById(idBurgBtn).checked;

    return berChecked ? "Berlin" : burgChecked ? "Brandenburg" : "";
}

function getSeverityLevelFromRadioBtn(idLv1, idLv2, idLv3) {
    const lv1 = document.getElementById(idLv1).checked;
    const lv2 = document.getElementById(idLv2).checked;
    const lv3 = document.getElementById(idLv3).checked;

    return lv1 ? 1 : lv2 ? 2 : lv3? 3 : 1;
}

async function updateBtnClicked(e) {
    e.preventDefault();

    let newLocation = {
        name: document.getElementById("updateLocationName").value,
        desc: document.getElementById("updateDescription").value,
        address: document.getElementById("updateLocationAdress").value,
        city: document.getElementById("updateCity").value,
        zip: document.getElementById("updateZipCode").value,
        state: getStateFromRadioBtn("updateBer", "updateBurg"),
        severity: getSeverityLevelFromRadioBtn("updateSeverityLvl1", "updateSeverityLvl2", "updateSeverityLvl3")
    }

    let locationAvailable = await setCoordinatesByAddress(newLocation);
    if (!locationAvailable) {
        alert("Invalid adress.");
        return;
    }

    removeLocation(inspectedLocation);
    addLocation(newLocation);

    inspectedLocation = null;
    hideAllDivsAndShow(MAIN_SCREEN);
}

function deleteBtnClicked(e) {
    e.preventDefault();
    
    removeLocation(inspectedLocation);

    inspectedLocation = null;
    hideAllDivsAndShow(MAIN_SCREEN);
}