import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const addPassword = async (req, res) => {
    
    const {siteName, siteUrl, email, password} = req.body; 
 
    try {

        if (!siteName ||!siteUrl ||!email ||!password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(req.user._id); 

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.savedPasswords.find(p => p.email === email && p.siteName === siteName)) {
            return res.status(400).json({ success: false, message: "Same email for same site" });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        user.savedPasswords.push({
            siteName,
            siteUrl,
            email,
            password: hashedPassword
        })

        await user.save();

        return res.status(201).json({ success: true, message: "Password added successfully" });

        
    } catch (error) {
        console.error("Error in addPassword controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}; 

// not done
const editPassword = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in editPassword controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}; 

export const deletePassword = async (req, res) => {
    
    const {siteName, email} = req.body;
    
    try {

        if (!siteName ||!email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const passwordIndex = user.savedPasswords.findIndex(p => p.email === email && p.siteName === siteName);

        if (passwordIndex === -1) {
            return res.status(404).json({ success: false, message: "Password not found" });
        }

        user.savedPasswords.splice(passwordIndex, 1);

        await user.save();

        return res.status(200).json({ success: true, message: "Password deleted successfully" });
        
    } catch (error) {
        console.error("Error in deletePassword controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteAllPasswords = async (req, res) => {
    try {
        
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.savedPasswords = [];
        
        await user.save();

        return res.status(200).json({ success: true, message: "All passwords deleted successfully" });
    } catch (error) {
        console.error("Error in deleteAllPasswords controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// not done
const getPassword = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in getPassword controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// not done
const searchPasswords = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in searchPasswords controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }  
};  

// not done
const getAllPasswords = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Error in getAllPasswords controller: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};