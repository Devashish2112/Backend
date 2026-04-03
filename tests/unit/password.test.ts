import { hashPassword, comparePassword } from '../../src/utils/password';

describe('Password utilities', () => {
  it('hashes and validates password correctly', async () => {
    const plain = 'StrongPass#123';
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    await expect(comparePassword(plain, hash)).resolves.toBe(true);
    await expect(comparePassword('WrongPass#123', hash)).resolves.toBe(false);
  });
});
