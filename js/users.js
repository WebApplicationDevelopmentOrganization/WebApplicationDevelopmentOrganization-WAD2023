export default getUserByName;

function getUserByName(username) {
    const userRoles = new Map([
        ["admina", admina],
        ["normalo", normalo]
    ]);

    if (userRoles.has(username)) {
        return userRoles.get(username);
    }

    return null;
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