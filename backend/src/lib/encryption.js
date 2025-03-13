import crypto from 'crypto';
import dotenv from "dotenv"

dotenv.config()

/**
 * Encrypts a string using AES-256-CBC encryption
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text in the format 'iv:encryptedData'
 */

const SECRET_KEY_ENCRYPT = process.env.SECRET_KEY_ENCRYPT; 

console.log(SECRET_KEY_ENCRYPT)
export const encrypt = (text) => {
  try {
    // Create a buffer from the secret key (must be 32 bytes for AES-256)
    const key = crypto.scryptSync(SECRET_KEY_ENCRYPT, 'salt', 32);
    
    // Create an initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return the IV and encrypted data as a single string
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts a string that was encrypted using the encrypt function
 * @param {string} encryptedText - The encrypted text in the format 'iv:encryptedData'
 * @returns {string} - The decrypted text
 */
export const decrypt = (encryptedText) => {
  try {
    // Split the encrypted text to get the IV and actual encrypted data
    const [ivHex, encryptedData] = encryptedText.split(':');
    
    if (!ivHex || !encryptedData) {
      throw new Error('Invalid encrypted text format');
    }
    
    // Create a buffer from the secret key (must be 32 bytes for AES-256)
    const key = crypto.scryptSync(SECRET_KEY_ENCRYPT, 'salt', 32);
    
    // Convert IV from hex to Buffer
    const iv = Buffer.from(ivHex, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Failed to decrypt data');
  }
};