// frontend/src/api/passwordService.js
import backend from "./db";

const passwordService = {
  // Get all passwords for the current user
  getAllPasswords: async () => {
    try {
      const response = await backend.get("/password/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch passwords" };
    }
  },

  // Add a new password
  addPassword: async (passwordData) => {
    try {
      const response = await backend.post("/password/add", passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add password" };
    }
  },

  // Get a specific password by site name and email
  getPassword: async (siteName, email) => {
    try {
      const response = await backend.get(`/password/${siteName}/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get password" };
    }
  },

  // Delete a specific password
  deletePassword: async (siteName, email) => {
    try {
      const response = await backend.delete("/password", {
        data: { siteName, email },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete password" };
    }
  },

  // Delete all passwords
  deleteAllPasswords: async () => {
    try {
      const response = await backend.delete("/password/all");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to delete all passwords" }
      );
    }
  },

  // Edit an existing password
  editPassword: async (oldSiteName, oldEmail, passwordData) => {
    try {
      const response = await backend.put("/password/edit", {
        oldSiteName,
        oldEmail,
        ...passwordData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update password" };
    }
  },
};

export default passwordService;
