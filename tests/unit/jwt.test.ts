import { generateToken, verifyToken, decodeToken, JWTError } from '../../src/utils/jwt';

describe('JWT utilities', () => {
  const payload = {
    id: 'user-1',
    email: 'user@example.com',
    role: 'ADMIN',
  } as const;

  it('generates and verifies a valid token', () => {
    const token = generateToken(payload as any);
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('throws JWTError for invalid token', () => {
    expect(() => verifyToken('invalid.token.value')).toThrow(JWTError);
  });

  it('returns null when decode fails', () => {
    expect(decodeToken('invalid.token.value')).toBeNull();
  });
});
