import createUser, {
  generateID,
  saveUser,
  getUserById,
  deleteUserById,
  findUserByUsername,
  updateUserById,
} from "../dataObjects/users.mjs";

import { hashPassword, verifyPassword } from "../modules/passwords.mjs";

function safeUser(u) {
  if (!u) return u;
  const { password, ...rest } = u; 
  return rest;
}

export function registerUser({ acceptToS, username, password, email } = {}) {
  if (acceptToS !== true) {
    return { status: 400, body: { error: "You must accept the Terms of Service to create an account" } };
  }

  if (typeof username !== "string" || username.trim().length < 3) {
    return { status: 400, body: { error: "Username must be at least 3 characters" } };
  }

  if (typeof password !== "string" || password.trim().length < 5) {
    return { status: 400, body: { error: "Password must be at least 5 characters" } };
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return { status: 400, body: { error: "Invalid email" } };
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim();

  if (findUserByUsername(cleanUsername)) {
    return { status: 409, body: { error: "Username already exists" } };
  }

  const u = createUser();
  u.id = generateID();           
  u.tosAccepted = true;
  u.username = cleanUsername;
  u.email = cleanEmail;
  u.password = hashPassword(password); 

  saveUser(u);

  return { status: 201, body: safeUser(u) };
}

export function loginUser({ username, password } = {}) {
  if (typeof username !== "string" || typeof password !== "string") {
    return { status: 400, body: { error: "Missing username or password" } };
  }

  const cleanUsername = username.trim();

  const u = findUserByUsername(cleanUsername);
  if (!u) return { status: 401, body: { error: "Invalid username or password" } };

  if (!verifyPassword(password, u.password)) {
    return { status: 401, body: { error: "Invalid username or password" } };
  }

  return { status: 200, body: safeUser(u) };
}

export function getUser(id) {
  const u = getUserById(id);
  if (!u) return { status: 404, body: { error: "User not found" } };
  return { status: 200, body: safeUser(u) };
}

export function patchUser(id, patch = {}) {
  const cleanPatch = { ...patch };

  if (typeof cleanPatch.password === "string" && cleanPatch.password.trim().length >= 5) {
    cleanPatch.password = hashPassword(cleanPatch.password);
  } else {
    delete cleanPatch.password; 
  }

  const updated = updateUserById(id, cleanPatch);
  if (!updated) return { status: 404, body: { error: "User not found" } };

  return { status: 200, body: safeUser(updated) };
}

export function removeUser(id) {
  const ok = deleteUserById(id);
  if (!ok) return { status: 404, body: { error: "User not found" } };

  return { status: 200, body: { deleted: true, message: "Account deleted and consent withdrawn" } };
}