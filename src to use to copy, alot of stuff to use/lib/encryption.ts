import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

// Get encryption key from environment or generate one
function getEncryptionKey(): Buffer {
  const keyString = process.env.ENCRYPTION_KEY;
  
  if (!keyString) {
    console.warn('ENCRYPTION_KEY not found in environment variables. Using generated key (not secure for production!)');
    // Generate a key for development - NOT SECURE FOR PRODUCTION
    return crypto.randomBytes(KEY_LENGTH);
  }
  
  // Convert hex string to buffer
  return Buffer.from(keyString, 'hex');
}

/**
 * Encrypt data using AES-256-GCM
 * @param text - The text to encrypt
 * @returns Encrypted data as hex string
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, key);
    
    cipher.setAAD(Buffer.from('aegis-spectra', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine IV + tag + encrypted data
    const combined = iv.toString('hex') + tag.toString('hex') + encrypted;
    
    return combined;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - The encrypted data as hex string
 * @returns Decrypted text
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    
    // Extract IV, tag, and encrypted data
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const tag = Buffer.from(encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2), 'hex');
    const encrypted = encryptedData.slice((IV_LENGTH + TAG_LENGTH) * 2);
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from('aegis-spectra', 'utf8'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data (one-way encryption)
 * @param data - The data to hash
 * @returns Hashed data
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random key for encryption
 * @returns Random key as hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Verify if data is encrypted (basic check)
 * @param data - The data to check
 * @returns True if data appears to be encrypted
 */
export function isEncrypted(data: string): boolean {
  // Basic check - encrypted data should be hex and longer than plain text
  return /^[0-9a-f]+$/i.test(data) && data.length > 50;
}

// Database field encryption helpers
export const EncryptedField = {
  /**
   * Encrypt a field before storing in database
   */
  encrypt: (value: string | null): string | null => {
    if (!value) return null;
    return encrypt(value);
  },
  
  /**
   * Decrypt a field after retrieving from database
   */
  decrypt: (value: string | null): string | null => {
    if (!value) return null;
    try {
      return decrypt(value);
    } catch (error) {
      console.error('Failed to decrypt field:', error);
      return null;
    }
  }
};

// Audit logging for encryption operations
export function logEncryptionOperation(operation: 'encrypt' | 'decrypt', field: string, success: boolean) {
  const timestamp = new Date().toISOString();
  console.log(`[ENCRYPTION] ${timestamp} - ${operation.toUpperCase()} ${field} - ${success ? 'SUCCESS' : 'FAILED'}`);
  
  // In production, this should be logged to a secure audit system
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to secure audit logging system
  }
}
