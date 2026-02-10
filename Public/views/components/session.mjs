const KEY = "currentUser";

export function saveUser(user) {
  sessionStorage.setItem(KEY, JSON.stringify(user));
}

export function loadUser() {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  sessionStorage.removeItem(KEY);
}
