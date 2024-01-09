
const LOGIN_SCREEN = "loginScreen";
const MAIN_SCREEN = "mainScreen";
const ADD_SCREEN = "addScreen";
const UPDATE_DELETE_SCREEN = "updateDeleteScreen";

const LOCATIONS_LIST = "locationsList";

const ROLE_ADMIN = "admin";
const ROLE_NORMAL = "non-admin";

let activeUser = null;
let isUserLoggedIn = false;
let inspectedLocationID = null;
let markersDict = new Map();

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

let map;

async function initMap() {
    map = L.map('map').setView([52.51999807860289, 13.404877357255282], 12.25);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const locations = await getAllLocations();
    locations.forEach(addLocationToMap);
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

////////////////////////////////////////////////////////////////////////////////
////                            Page Set Up                                 ////
////////////////////////////////////////////////////////////////////////////////

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

function setUpMainPage() {
    let addBtn = document.getElementById("addBtn");

    if (activeUser.role !== ROLE_ADMIN) {
        addBtn.style.display = "none";
    } else {
        addBtn.style = "";
    }

    document.getElementById("usernameWelcomeMessage").innerText = activeUser.firstname;
}

async function setUpUpdateDeletePage(locationID) {
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

        document.getElementById("updateLat").disabled = true;
        document.getElementById("updateLon").disabled = true;

        updateBtn.style.display = "";
        deleteBtn.style.display = "";
    }

    const location = await getLocation(locationID)

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

    inspectedLocationID = location._id;
}

////////////////////////////////////////////////////////////////////////////////
////                            Button Events                               ////
////////////////////////////////////////////////////////////////////////////////

async function getAllLocations() {
    try {
        const response = await fetch("http://localhost:3000/loc", {
            method: "GET",
            headers: {
                accept: "application.json",
            },
        });

        if (response.ok) {
            return response.json()
        } else {
            console.error("error fetching locations")
            return;
        }
    } catch (error) {
        console.error("error fetching locations")
        return
    }
}

async function getLocation(locationID) {
    try {
        const response = await fetch("http://localhost:3000/loc/" + locationID, {
            method: "GET",
        });

        if (response.ok) {
            return response.json();
        } else {
            console.error("location does not exist");
            return;
        }
    } catch (error) {
        console.error("error fetching locations");
        return;
    }
}

async function addLocation(location) {
    try {
        const response = await fetch("http://localhost:3000/loc", {
            method: "POST",
            headers: {
                accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(location)
        });

        if (response.ok) {
            let id = response.headers['location'];
            console.log(id)
            console.log(response.headers)
            id = id.replace('/loc/', "")
            location._id = id
            addLocationToMap(location);
            return true
        } else {
            alert("Location could not be added due to an error.");
            return false
        }
    } catch (error) {
        console.error(error)
        console.error("error adding location")
        return false
    }
}

async function removeLocation(locationID) {
    try {
        const response = await fetch("http://localhost:3000/loc/" + locationID, {
            method: "DELETE",
        });

        if (response.ok) {
            removeLocationFromMap(locationID)
            return
        } else {
            alert("Location could not be removed.");
            return;
        }
    } catch (error) {
        console.error("error removing location")
        return;
    }
}

function removeLocationFromMap(locationID) {
    let marker = markersDict.get(locationID)
    map.removeLayer(marker);
    markersDict.delete(locationID)

    const locationsList = document.getElementById(LOCATIONS_LIST);
    const listItemToRemove = document.getElementById(locationID + "_li");
    if (listItemToRemove) {
        locationsList.removeChild(listItemToRemove);
    } else {
        console.warn(`Element \"${locationID}\_li" not found.`);
    }
}

function addLocationToMap(location) {
    let marker = L.marker([location.lat, location.lon]).addTo(map);
    marker.bindPopup(location.name);
    markersDict.set(location._id, marker)

    const locationsList = document.getElementById(LOCATIONS_LIST);
    const listItem = document.createElement('li');
    listItem.id = location._id + "_li";
    listItem.style.textAlign = 'center';
    listItem.style.display = 'flex';
    listItem.style.flexDirection = 'column';
    listItem.style.alignItems = 'center';
    listItem.style.justifyContent = 'center';
    listItem.innerHTML = `<Button id="${location.name}" class="hover:text-gray-400 text-center" >${location.name}: <br> ${location.address}, <br> ${location.zip} ${location.city} </Button>`;
    listItem.addEventListener('click', () => {
        hideAllDivsAndShow(UPDATE_DELETE_SCREEN, location._id);
    });
    locationsList.appendChild(listItem);
}

async function checkLogin(e) {
    e.preventDefault();

    const usernameEntered = document.getElementById("username").value;
    const passwordEntered = document.getElementById("password").value;

    const postBody = JSON.stringify({
        "username": usernameEntered,
        "password": passwordEntered
    })

    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                accept: "application.json",
                "Content-Type": "application/json",
            },
            body: postBody
        });

        if (response.ok) {
            activeUser = await response.json();
            isUserLoggedIn = true;
            hideAllDivsAndShow(MAIN_SCREEN);
        } else {
            alert("Incorrect username or password!");
            isUserLoggedIn = false;
            return;
        }
    } catch (error) {
        console.error("error fetching users")
        return;
    }
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

    let success = addLocation(newLocation);
    if (success) {
        hideAllDivsAndShow(MAIN_SCREEN);
    }
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

async function updateLocation(updatedLocation) {
    try {
        const response = await fetch("http://localhost:3000/loc/" + locationID, {
            method: "PUT",
            headers: {
                accept: "application.json",
            },
            body: JSON.stringify(updatedLocation)
        });

        if (response.ok) {
            removeLocationFromMap(inspectedLocationID);
            addLocationToMap(updatedLocation);
        } else {
            console.error("location does not exist")
            return;
        }
    } catch (error) {
        console.error("error fetching locations")
    }
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

    await updateLocation(newLocation)

    inspectedLocationID = null;
    hideAllDivsAndShow(MAIN_SCREEN);
}

async function deleteBtnClicked(e) {
    e.preventDefault();
    
    await removeLocation(inspectedLocationID);

    inspectedLocationID = null;
    hideAllDivsAndShow(MAIN_SCREEN);
}

////////////////////////////////////////////////////////////////////////////////
////                            Helper Functions                            ////
////////////////////////////////////////////////////////////////////////////////

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