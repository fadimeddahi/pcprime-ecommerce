// JWT Decoding Utility

export interface JWTPayload {
  [key: string]: any;
  sub?: string;
  user_id?: string;
  id?: string;
  exp?: number;
  iat?: number;
}

/**
 * Generate a deterministic UUID from a string (email or username)
 * This creates a consistent UUID format that looks like: xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx
 * where x is any hex digit and y is 8, 9, a, or b
 */
export function generateDeterministicUUID(input: string): string {
  let hash = 0;
  
  // Create a simple hash from the input string
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad to 32 characters
  const hashHex = Math.abs(hash).toString(16).padStart(32, '0');
  
  // Create more entropy by combining different parts of the input
  let hash2 = 5381;
  for (let i = 0; i < input.length; i++) {
    hash2 = ((hash2 << 5) + hash2) + input.charCodeAt(i);
  }
  const hashHex2 = Math.abs(hash2).toString(16).padStart(32, '0');
  
  // Combine the two hashes for better distribution
  let combined = '';
  for (let i = 0; i < 32; i++) {
    const byte = (parseInt(hashHex[i], 16) + parseInt(hashHex2[31 - i], 16)) % 16;
    combined += byte.toString(16);
  }
  
  // Format as valid UUID v5 (version 5, variant 1)
  // Format: 8-4-4-4-12
  const uuid =
    combined.substring(0, 8) + '-' +
    combined.substring(8, 12) + '-' +
    '5' + combined.substring(13, 16) + '-' +
    ((parseInt(combined.substring(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
    combined.substring(18, 20) + '-' +
    combined.substring(20, 32);
  
  return uuid;
}

/**
 * Decode a JWT token (without verification - for client-side only)
 * WARNING: This does NOT verify the signature - only decode the payload
 * Never use this for security-critical decisions
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format - expected 3 parts');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64
    const decoded = atob(padded);
    
    // Parse JSON
    const parsed = JSON.parse(decoded);
    
    return parsed as JWTPayload;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
}

/**
 * Extract user ID from JWT token
 * Looks for: sub, user_id, or id fields
 */
export function extractUserIdFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  // Try common field names for user ID
  const userId = payload.sub || payload.user_id || payload.userId || payload.id || payload.uid || null;
  
  return userId;
}

/**
 * Check if JWT token is expired
 */
export function isJWTExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return false; // Can't determine, assume valid
  }

  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  return Date.now() > expiryTime;
}
