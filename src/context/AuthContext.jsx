import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { storage } from "../services/storage";

const AuthContext = createContext(null);

const STORAGE_KEY = "authUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.read(STORAGE_KEY));
  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync
  useEffect(() => {
    if (user) storage.write(STORAGE_KEY, user);
    else storage.remove(STORAGE_KEY);
  }, [user]);

  const login = async (email, pin) => {
    setLoading(true);
    try {
      const loggedIn = await api.login(email, pin);
      setUser(loggedIn);
      toast.success(`Welcome back, ${loggedIn.name.split(" ")[0]}!`);
      return loggedIn;
    } catch (err) {
      toast.error(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
