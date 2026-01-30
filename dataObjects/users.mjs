const Users = {};

export function saveUser(user) {
    Users [user.id]= user;
}

export function getUser(id) {
    return Users[id] ?? null;
}

export function getUserById(id) {
    return Users[id] ?? null;
}

function user() {
    return { 
        id: null,
        tosAccepted: false,
    };
}

export function generateID() {
    let id = null;
    do {
        id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
    } while (Users[id]);

    return id;
}

export default user;