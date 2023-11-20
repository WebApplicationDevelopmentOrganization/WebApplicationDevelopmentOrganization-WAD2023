let username = null;
let isUserLoggedIn = false;
let userRole = null;

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
    document.getElementById('Login-Form').onsubmit = checkLogin;
});

function checkLogin(e) {
    e.preventDefault();

    const usernameEntered = document.getElementById("username").value;
    const passwordEntered = document.getElementById("password").value;

    if (!loginCredentialsCorrect(usernameEntered, passwordEntered)) {
        alert("Incorrect username or password!");
        isUserLoggedIn = false;
        return;
    }

    console.log("???")
    username = usernameEntered;
    isUserLoggedIn = true;
    userRole = getUserRole();

    hideAllDivsAndShow("Main-Screen");
}

const admina = {
    username: "admina",
    password: "password",
    role:"admin"
};

const normalo = {
    username: "normalo",
    password: "password",
    role:"non-admin"
};

function loginCredentialsCorrect(username, password) {
    switch (username) {
        case admina.username:
            return password === admina.password;

        case normalo.username:
            return password === normalo.password;

        default:
            return false;
    }
}

function getUserRole() {
    const admins = ["admina"]
    const normals = ["normalo"]

    admins.forEach(function(adminName) {
        if (adminName === username) {
            return "admin";
        }
    })

    normals.forEach(function(normalName) {
        if (normalName === username) {
            return "normal";
        }
    })

    return null;
}