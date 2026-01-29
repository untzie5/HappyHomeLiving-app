const Users = {};

function user() {
    return { 
        id: null,
        tosAccepted: false,
        tosAccepted: null
    };
}

export function generateID() {
    let id = null;
    do {
        id = (Math.random() * Number.MAX_SAFE_INTEGER).toString(10);
    } while (Users[id]);

    return id;
}

export default user;