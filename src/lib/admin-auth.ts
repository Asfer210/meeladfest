export const ADMIN_USERNAME = "Admin";
export const ADMIN_PASSWORD = "Admin@5001";

const SESSION_KEY = "scoreboard-admin-session";

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

/** Only the login flag is kept in session storage — never any scores. */
export function readSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function writeSession(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) window.sessionStorage.setItem(SESSION_KEY, "1");
  else window.sessionStorage.removeItem(SESSION_KEY);
}
