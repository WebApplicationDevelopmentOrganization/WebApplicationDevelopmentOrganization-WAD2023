export default getUserByName;
export { ROLE_ADMIN, ROLE_NORMAL };

const ROLE_ADMIN = "admin";
const ROLE_NORMAL = "non-admin";

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
    role:ROLE_ADMIN
};

const normalo = {
    username: "normalo",
    password: "password",
    role:ROLE_NORMAL
};