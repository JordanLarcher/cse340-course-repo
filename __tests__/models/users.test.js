import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';

const mockQuery = jest.fn();

jest.unstable_mockModule('../../src/models/db.js', () => ({
  default: { query: mockQuery },
}));

const {
  createUser,
  getUserByEmail,
  authenticateUser,
  getAllUsers,
} = await import('../../src/models/users.js');

describe('Users Model', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('createUser', () => {
    it('should create a user and return the user_id', async () => {
      mockQuery.mockResolvedValue({ rows: [{ user_id: 1 }], rowCount: 1 });

      const userId = await createUser('Alice', 'alice@example.com', 'hashedpassword123');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['Alice', 'alice@example.com', 'hashedpassword123', 'user']
      );
      expect(userId).toBe(1);
    });

    it('should throw an error when no rows are returned', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(createUser('Alice', 'alice@example.com', 'hash'))
        .rejects.toThrow('Failed to create user');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user data when email exists', async () => {
      const mockUser = {
        user_id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password_hash: 'hashedpassword123',
        role_name: 'user',
      };
      mockQuery.mockResolvedValue({ rows: [mockUser] });

      const user = await getUserByEmail('alice@example.com');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['alice@example.com']
      );
      expect(user).toEqual(mockUser);
    });

    it('should return null when email does not exist', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const user = await getUserByEmail('unknown@example.com');
      expect(user).toBeNull();
    });
  });

  describe('authenticateUser', () => {
    it('should return user data without password_hash on success', async () => {
      const mockUser = {
        user_id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password_hash: '$2b$10$hashedpassword',
        role_name: 'user',
      };
      mockQuery.mockResolvedValue({ rows: [mockUser] });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authenticateUser('alice@example.com', 'password123');

      expect(result).toEqual({
        user_id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role_name: 'user',
      });
      expect(result.password_hash).toBeUndefined();
    });

    it('should return null when user is not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await authenticateUser('unknown@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null when password does not match', async () => {
      mockQuery.mockResolvedValue({
        rows: [{
          user_id: 1,
          name: 'Alice',
          email: 'alice@example.com',
          password_hash: '$2b$10$hashed',
          role_name: 'user',
        }],
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authenticateUser('alice@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users sorted by name', async () => {
      const mockUsers = [
        { user_id: 1, name: 'Alice', email: 'alice@example.com', role_name: 'admin' },
        { user_id: 2, name: 'Bob', email: 'bob@example.com', role_name: 'user' },
      ];
      mockQuery.mockResolvedValue({ rows: mockUsers });

      const users = await getAllUsers();
      expect(users).toEqual(mockUsers);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('ORDER BY u.name ASC'));
    });
  });
});
