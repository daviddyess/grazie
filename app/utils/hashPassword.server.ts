/**
 * Grazie
 * @package Hash Password Utility
 * @copyright Copyright (c) 2025 David Dyess II
 * @license MIT see LICENSE
 */
import { scrypt, randomBytes, timingSafeEqual, type BinaryLike } from 'crypto';
import { promisify } from 'util';

// Convert scrypt to promise-based function
const scryptAsync = promisify(scrypt);

// Configuration
const SALT_LENGTH = 32; // Length of salt in bytes
const KEY_LENGTH = 64; // Length of derived key in bytes
const SEPARATOR = '.'; // Character to separate salt and hash

/**
 * Hashes a password using scrypt with a random salt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password with salt, formatted as salt.hash
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Generate a random salt
    const salt = randomBytes(SALT_LENGTH);

    // Hash the password with the salt
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

    // Combine salt and derived key
    return `${salt.toString('base64')}${SEPARATOR}${derivedKey.toString(
      'base64'
    )}`;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
}

/**
 * Verifies a password against a hash
 * @param {string} password - The password to verify
 * @param {string} hashedPassword - The stored hash to verify against
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
export async function verifyPassword(
  password: BinaryLike,
  hashedPassword: String
) {
  try {
    // Split the stored hash into salt and key
    const [saltString, hashString] = hashedPassword.split(SEPARATOR);

    if (!saltString || !hashString) {
      throw new Error('Invalid hash format');
    }

    // Convert base64 strings back to buffers
    const salt = Buffer.from(saltString, 'base64');
    const storedHash = Buffer.from(hashString, 'base64');

    // Hash the input password with the same salt
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

    // Compare the hashes using timing-safe comparison
    return timingSafeEqual(storedHash, derivedKey);
  } catch (error) {
    throw new Error('Error verifying password: ' + error.message);
  }
}
