import { db } from "@/src/db/client";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { clearUserId, loadUserId, saveUserId } from "./storage";

// User details to keep after logging in
interface AuthUser {
  id: number;
  name: string;
  email: string;
}

//Everything that the auth context will give to the app
interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteProfile: () => Promise<void>;
}

//Create the auth context
const AuthContext = createContext<AuthContextValue | null>(null);

// Hashes password before storing it
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Checks if a user ID was saved before
  useEffect(() => {
    (async () => {
      try {
        const savedId = await loadUserId();
        if (savedId) {
          const rows = await db
            .select({ id: users.id, name: users.name, email: users.email })
            .from(users)
            .where(eq(users.id, savedId))
            .limit(1);
          if (rows.length > 0) {
            setUser(rows[0]);
          } else {
            await clearUserId();
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Registers a user, saves them to database and logs them in
  const register = async (name: string, email: string, password: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      throw new Error("All fields are required.");
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("An account with this email already exists.");
    }

    const result = await db.insert(users).values({
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: hashPassword(password),
      createdAt: Date.now(),
    }).returning({ id: users.id });

    const newId = result[0].id;
    await saveUserId(newId);
    setUser({ id: newId, name: trimmedName, email: trimmedEmail });
  };

  // Logs in user by checking email and password
  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      throw new Error("Email and password are required.");
    }

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .limit(1);

    if (rows.length === 0) {
      throw new Error("Invalid email or password.");
    }

    const found = rows[0];

    if (found.passwordHash !== hashPassword(password)) {
      throw new Error("Invalid email or password.");
    }

    await saveUserId(found.id);
    setUser({ id: found.id, name: found.name, email: found.email });
  };

  // Logs user out
  const logout = async () => {
    await clearUserId();
    setUser(null);
  };

  // Deletes user profile from database and logs them out
  const deleteProfile = async () => {
    if (!user) return;
    await db.delete(users).where(eq(users.id, user.id));
    await clearUserId();
    setUser(null);
  };

  // Makes auth data and functions available to app
  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, deleteProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context in other components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}