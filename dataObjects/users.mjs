const Users = {};

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
export function saveUser(user) {
    Users[user.id]= user;
}

export function getUserById(id) {
    return Users[id] ?? null;
}


export function deleteUserById(id) {
    if (!Users[id]) return false;
    delete Users[id];
    return true;
}
export default user;
