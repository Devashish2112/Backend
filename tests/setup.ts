process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/testdb';
process.env.JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
process.env.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || '4';
