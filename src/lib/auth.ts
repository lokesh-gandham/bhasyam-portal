const AUTH_STORAGE_KEY = "bhasyam_auth_session";
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "#RShanu@2026#";

function generateToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return btoa(`${payload}:${Math.abs(hash).toString(36)}`);
}

export interface AuthSession {
  token: string;
  username: string;
  loginTime: number;
}

export function validateCredentials(username: string, password: string): boolean {
  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

export function createSession(username: string): AuthSession {
  const session: AuthSession = {
    token: generateToken(username),
    username,
    loginTime: Date.now(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (!session.token || !session.username || !session.loginTime) return null;
    return session;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
