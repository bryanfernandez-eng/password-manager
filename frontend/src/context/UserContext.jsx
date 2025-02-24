import React, { createContext, useState, useEffect, useContext } from "react";
import { backend } from "../services/backend";

const UserContext = createContext();

const useUserContextState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Outside - User:", user);

  const login = async (email, password) => {
    try {
      await backend.post("/auth/login", { email, password });
      await checkAuth();
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "An error occurred during login",
      };
    }
  };

  const logout = async () => {
    try {
      await backend.post("/auth/logout");
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "An error occurred during logout",
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      await backend.post("/auth/signup", { name, email, password });
      await checkAuth();
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "An error occurred during signup",
      };
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await backend.get("/auth/check");
      console.log("-- -- ---------------- response:", response);
      setUser(response.data.user);
      console.log("Auth - User:", user);
      return { success: true };
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      return {
        success: false,
        error: error.response?.data?.message || "Authentication failed",
      };
    } finally {
      setLoading(false);
      console.log("-- -- user: ", user);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, login, logout, signup, checkAuth, loading };
};

export const UserProvider = ({ children }) => {
  const userContext = useUserContextState();
  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
