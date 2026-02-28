import { pool } from "../db.mjs";

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
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    tosAccepted: row.tos_accepted,
  };
}

export async function saveUser(u) {
  const q = `
    insert into users (id, username, email, password, tos_accepted)
    values ($1, $2, $3, $4, $5)
    returning id, username, email, password, tos_accepted
  `;
  const r = await pool.query(q, [u.id, u.username, u.email, u.password, u.tosAccepted]);
  return rowToUser(r.rows[0]);
}

export async function getUserById(id) {
  const r = await pool.query(
    `select id, username, email, password, tos_accepted from users where id = $1`,
    [id]
  );
  return rowToUser(r.rows[0]);
}

export async function deleteUserById(id) {
  const r = await pool.query(`delete from users where id = $1`, [id]);
  return r.rowCount > 0;
}

export async function findUserByUsername(username) {
  const r = await pool.query(
    `select id, username, email, password, tos_accepted from users where username = $1`,
    [username]
  );
  return rowToUser(r.rows[0]);
}

export async function updateUserById(id, updates = {}) {
  const fields = [];
  const values = [];
  let i = 1;

  if (typeof updates.username === "string" && updates.username.trim().length >= 3) {
    fields.push(`username = $${i++}`);
    values.push(updates.username.trim());
  }

  if (typeof updates.email === "string" && updates.email.includes("@")) {
    fields.push(`email = $${i++}`);
    values.push(updates.email.trim());
  }

  if (typeof updates.password === "string" && updates.password.length > 0) {
    fields.push(`password = $${i++}`);
    values.push(updates.password);
  }

  if (typeof updates.tosAccepted === "boolean") {
    fields.push(`tos_accepted = $${i++}`);
    values.push(updates.tosAccepted);
  }

  if (fields.length === 0) return await getUserById(id);

  values.push(id);
  const q = `
    update users
    set ${fields.join(", ")}
    where id = $${i}
    returning id, username, email, password, tos_accepted
  `;

  const r = await pool.query(q, values);
  return rowToUser(r.rows[0] ?? null);
}

export default user;