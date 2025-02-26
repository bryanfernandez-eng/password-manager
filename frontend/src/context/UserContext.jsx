import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import backend from "../api/db";

const UserContext = createContext();

const useUserContextState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleError = useCallback(
    (error, defaultMessage) => ({
      success: false,
      error: error.response?.data?.message || defaultMessage,
    }),
    []
  );

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await backend.post("/auth/login", { email, password });
        console.log(response)
        setUser(response);
        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return handleError(error, "An error occurred during login");
      }
    },
    [handleError]
  );

  const logout = useCallback(async () => {
    try {
      await backend.post("/auth/logout");
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return handleError(error, "An error occurred during logout");
    }
  }, [handleError]);

  const signup = useCallback(
    async (name, email, password) => {
      try {
        const response = await backend.post("/auth/signup", {
          name,
          email,
          password,
        });
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error("Signup error:", error);
        return handleError(error, "An error occurred during signup");
      }
    },
    [handleError]
  );

  const verifyCode = useCallback(
    async (email, verificationCode) => {
      try {
        const response = await backend.post("/auth/verify", {
          email,
          verificationCode,
        });
        setUser(response.data.message);
        return { success: true };
      } catch (error) {
        console.error("Verification error:", error);
        return handleError(error, "An error occurred during verification");
      }
    },
    [handleError]
  );

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await backend.get("/auth/status");
      setUser(response.data);
      return { success: true };
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      return handleError(error, "Authentication failed");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteAccount = useCallback(async () => {
    try {
      await backend.delete("/auth/delete");
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      return handleError(error, "An error occurred while deleting the account");
    }
  }, [handleError]);

  const updateAccount = useCallback(
    async (name, password) => {
      try {
        const response = await backend.put("/auth/update", { name, password });
        setUser(response.data.message);
        return { success: true };
      } catch (error) {
        console.error("Update account error:", error);
        return handleError(
          error,
          "An error occurred while updating the account"
        );
      }
    },
    [handleError]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  return useMemo(
    () => ({
      user,
      login,
      logout,
      signup,
      verifyCode,
      checkAuth,
      deleteAccount,
      updateAccount,
      loading,
    }),
    [
      user,
      login,
      logout,
      signup,
      verifyCode,
      checkAuth,
      deleteAccount,
      updateAccount,
      loading,
    ]
  );
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
