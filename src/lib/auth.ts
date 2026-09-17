const AUTH_STORAGE_KEY = "bhasyam_auth_session";

function getEnvValue(name: string): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const envValue = import.meta.env[name];
    if (typeof envValue === "string" && envValue.trim()) return envValue;
  }

  const globalProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  const processValue = globalProcess?.env?.[name];
  if (typeof processValue === "string" && processValue.trim()) {
    return processValue;
  }

  return undefined;
}

const VALID_USERNAME = getEnvValue("VITE_BHASYAM_USERNAME") ?? "admin";
const VALID_PASSWORD = getEnvValue("VITE_BHASYAM_PASSWORD") ?? "#Passw0rd@2026#";

function encodeBase64(value: string): string {
  if (typeof btoa === "function") {
    return btoa(value);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64");
  }

  throw new Error("Base64 encoding is not available in this environment.");
}

function generateToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return encodeBase64(`${payload}:${Math.abs(hash).toString(36)}`);
}

export interface AuthSession {
  token: string;
  username: string;
  loginTime: number;
}

export function validateCredentials(username: string, password: string): boolean {
  return username.trim() === VALID_USERNAME && password === VALID_PASSWORD;
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
    const session = JSON.parse(raw) as Partial<AuthSession>;
    if (!session.token || !session.username || typeof session.loginTime !== "number" || !Number.isFinite(session.loginTime)) {
      return null;
    }
    return {
      token: session.token,
      username: session.username,
      loginTime: session.loginTime,
    };
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
