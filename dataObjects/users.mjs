const Users = {};

function user() {
  return {
    id: null,
    username: "",
    email: "",
    password: "",
    tosAccepted: false,
  };
}

export function generateID() {
  let id;
  do {
    id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
  } while (Users[id]);
  return id;
}

export function saveUser(u) {
  Users[u.id] = u;
  return u;
}

export function getUserById(id) {
  return Users[id] ?? null;
}

export function deleteUserById(id) {
  if (!Users[id]) return false;
  delete Users[id];
  return true;
}

export function findUserByUsername(username) {
  return Object.values(Users).find((u) => u.username === username) ?? null;
}

export function updateUserById(id, updates = {}) {
  const u = Users[id];
  if (!u) return null;

  if (typeof updates.username === "string" && updates.username.trim().length >= 3) {
    u.username = updates.username.trim();
  }

  if (typeof updates.email === "string" && updates.email.includes("@")) {
    u.email = updates.email.trim();
  }

  if (typeof updates.password === "string" && updates.password.length > 0) {
    u.password = updates.password;
  }

  if (typeof updates.tosAccepted === "boolean") {
    u.tosAccepted = updates.tosAccepted;
  }

  return u;
}

export default user;