import { createHmac } from 'crypto';

const SECRET = process.env.JWT_SECRET

// Base64 URL Encode (used for JWT encoding)
function base64UrlEncode(str: string) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')  // Remove '=' padding
    .replace(/\+/g, '-')  // Replace '+' with '-'
    .replace(/\//g, '_'); // Replace '/' with '_'
}

// Create the HMAC SHA-256 signature
function createSignature(header: string, payload: string) {
  if (!SECRET) {
    throw new Error('No JWT secret set');
  };
  
  const data = `${header}.${payload}`;

  return createHmac('sha256', SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')  // Remove '=' padding
    .replace(/\+/g, '-')  // Replace '+' with '-'
    .replace(/\//g, '_'); // Replace '/' with '_'
}

// Function to generate a JWT
export function generateToken(payload: object, expiresIn = '1h') {
  // 1. Create header (specifying algorithm and type)
  const header = {
    alg: 'HS256',  // HMAC SHA-256
    typ: 'JWT'
  };

  // 2. Add an expiry time to the payload
  const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
  const expTime = expiresIn === '1h' ? currentTime + 3600 : currentTime + parseInt(expiresIn); // 1 hour expiry

  // Add the expiration time to the payload
  const fullPayload = {
    ...payload,
    iat: currentTime, // Issued at time
    exp: expTime      // Expiration time
  };

  // 3. Encode header and payload as base64
  const base64Header = base64UrlEncode(JSON.stringify(header));
  const base64Payload = base64UrlEncode(JSON.stringify(fullPayload));

  // 4. Create signature
  const signature = createSignature(base64Header, base64Payload);

  // 5. Return the complete JWT
  return `${base64Header}.${base64Payload}.${signature}`;
}

export function verifyToken(token: string) {

  if (!token) {
    throw new Error('No token provided');
  };

  const [headerB64, payloadB64, signature] = token.split('.');

  // Recreate the signature
  const expectedSignature = createSignature(headerB64, payloadB64);

  // Check if the signature matches
  if (expectedSignature !== signature) {
    throw new Error('Invalid signature');
  }

  // Decode the payload (Base64 URL decode)
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));

  // Check if the token has expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp && currentTime > payload.exp) {
    throw new Error('Token has expired');
  }

  // Return the decoded payload
  return payload;
}