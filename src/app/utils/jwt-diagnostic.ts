// JWT Diagnostic Tool - For Debugging Backend Issues
// This file helps you understand what data is in your JWT token

import { decodeJWT } from '@/app/utils/jwt';

/**
 * Generate a diagnostic report of the JWT token
 * Call this with your JWT token to see what's inside
 */
export function generateJWTDiagnosticReport(token: string): {
  isValid: boolean;
  payload: any | null;
  report: string;
} {
  try {
    const payload = decodeJWT(token);
    
    if (!payload) {
      return {
        isValid: false,
        payload: null,
        report: `❌ Failed to decode JWT token. It may be malformed.`
      };
    }

    // Check for common user ID fields
    const hasUserIdField = payload.user_id || payload.userId || payload.id || payload.sub || payload.uid;
    const hasEmailField = payload.email;
    const hasUsernameField = payload.username;

    let report = `
🔍 JWT Token Diagnostic Report
================================

✅ Token Format: Valid
Token Payload Keys: ${Object.keys(payload).join(', ')}

📊 User ID Fields:
  - sub (subject): ${payload.sub || 'NOT FOUND'}
  - user_id: ${payload.user_id || 'NOT FOUND'}
  - userId: ${payload.userId || 'NOT FOUND'}
  - id: ${payload.id || 'NOT FOUND'}
  - uid: ${payload.uid || 'NOT FOUND'}

📧 Email Field:
  - email: ${payload.email || 'NOT FOUND'}

👤 Username Field:
  - username: ${payload.username || 'NOT FOUND'}

⏰ Expiration:
  - exp: ${payload.exp ? new Date(payload.exp * 1000).toISOString() : 'NOT FOUND'}
  - iat: ${payload.iat ? new Date(payload.iat * 1000).toISOString() : 'NOT FOUND'}

🔴 Issues Found:
`;

    if (!hasUserIdField) {
      report += `
❌ NO USER ID FIELD FOUND - This is the problem!
   The backend should include one of: sub, user_id, userId, or id
   in the JWT payload so the frontend can extract the user's UUID.
`;
    } else {
      report += `
✅ User ID Field Found: ${Object.keys(payload).find(k => 
  k === 'user_id' || k === 'userId' || k === 'id' || k === 'sub' || k === 'uid'
)}
   Value: ${hasUserIdField}
`;
    }

    if (!hasEmailField) {
      report += `\n⚠️  No email field in JWT`;
    }

    if (!hasUsernameField) {
      report += `\n⚠️  No username field in JWT`;
    }

    report += `

🎯 Recommendation:
${
  hasUserIdField
    ? `✅ The JWT contains a user ID. Update the frontend to extract from: "${
        Object.keys(payload).find(k => 
          k === 'user_id' || k === 'userId' || k === 'id' || k === 'sub' || k === 'uid'
        )
      }"`
    : `❌ Backend needs to be updated to include user ID in JWT token.
   Add one of these fields to the JWT payload when creating the token:
   - sub: "${payload.email || 'user-uuid'}" (standard JWT field)
   - user_id: "${payload.email || 'user-uuid'}" (custom field)
   - id: "${payload.email || 'user-uuid'}" (simple field)`
}

Full JWT Payload:
${JSON.stringify(payload, null, 2)}
`;

    return {
      isValid: true,
      payload,
      report
    };
  } catch (err: any) {
    return {
      isValid: false,
      payload: null,
      report: `❌ Error parsing JWT: ${err.message}`
    };
  }
}

/**
 * Print diagnostic report to console
 * Useful for debugging in browser console
 */
export function logJWTDiagnostics(token: string): void {
  const { report } = generateJWTDiagnosticReport(token);
  console.log(report);
}

/**
 * Example usage in your browser console:
 * 
 * 1. Get your JWT token from localStorage:
 *    const token = localStorage.getItem('auth_token');
 * 
 * 2. Import and call the diagnostic function:
 *    import { logJWTDiagnostics } from '@/app/utils/jwt-diagnostic';
 *    logJWTDiagnostics(token);
 * 
 * 3. This will print a detailed report showing:
 *    - All fields in the JWT
 *    - Which user ID field is present
 *    - Recommendations for backend team
 */
