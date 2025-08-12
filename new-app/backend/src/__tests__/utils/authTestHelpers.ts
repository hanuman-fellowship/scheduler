import jwt from 'jsonwebtoken';
import type { UserRole } from '@shared/types';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Precomputed bcrypt hash for 'password' - avoids expensive bcrypt.hash() in every test
// Generated with: await bcrypt.hash('password', 10)
export const PRECOMPUTED_PASSWORD_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

/**
 * Issues a test JWT token without hitting the database
 * @param userId - The user ID to encode in the token
 * @param roles - Array of user roles (optional, defaults to ['personnel'])
 * @returns JWT token string
 */
export const issueTestToken = (userId: number, roles: UserRole[] = ['personnel']): string => {
  return jwt.sign(
    { 
      userId,
      roles // Include roles in token for faster testing (though real app gets from DB)
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Creates a test user with precomputed password hash (much faster than bcrypt.hash)
 * @param userData - Partial user data
 * @returns User object with hashed password
 */
export const createTestUserData = (userData: {
  username?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
}) => {
  const timestamp = Date.now();
  return {
    username: userData.username || `testuser${timestamp}`,
    email: userData.email || `test${timestamp}@example.com`,
    password: PRECOMPUTED_PASSWORD_HASH, // Use precomputed hash instead of bcrypt.hash
    roles: userData.roles || ['personnel']
  };
};

/**
 * Mock bcrypt to always return true for password comparison
 * Use this in tests where you don't need real password validation
 */
export const mockBcryptAlwaysMatch = () => {
  const bcrypt = require('bcryptjs');
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  jest.spyOn(bcrypt, 'hash').mockResolvedValue(PRECOMPUTED_PASSWORD_HASH);
};

/**
 * Restore bcrypt mocks
 */
export const restoreBcryptMocks = () => {
  const bcrypt = require('bcryptjs');
  if (bcrypt.compare.mockRestore) {
    bcrypt.compare.mockRestore();
  }
  if (bcrypt.hash.mockRestore) {
    bcrypt.hash.mockRestore();
  }
};