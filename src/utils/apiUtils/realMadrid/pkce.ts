import crypto from 'crypto';

/**
 * Base64-url encode a buffer (RFC 4648 §5)
 */
export function base64URLEncode(buffer: Buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generate a PKCE code_verifier + SHA256 code_challenge
 */
export function generatePKCECodes() {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  const codeChallenge = base64URLEncode(hash);
  return { codeVerifier, codeChallenge };
}
