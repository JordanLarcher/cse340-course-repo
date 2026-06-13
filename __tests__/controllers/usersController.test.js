import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../src/models/users.js', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  authenticateUser: jest.fn(),
  getAllUsers: jest.fn(),
}));

const {
  requireLogin,
  requireRole,
  processLoginForm,
  processLogout,
} = await import('../../src/controllers/usersController.js');

describe('Users Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      session: {},
      flash: jest.fn(),
      body: {},
    };
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    };
    next = jest.fn();
  });

  describe('requireLogin', () => {
    it('should call next if user is logged in', () => {
      req.session.user = { id: 1, name: 'Alice' };

      requireLogin(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.flash).not.toHaveBeenCalled();
    });

    it('should flash error and redirect if user is not logged in', () => {
      requireLogin(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'You must be logged in to access this page.');
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should call next when user has the required role', () => {
      req.session.user = { id: 1, name: 'Admin', role_name: 'admin' };

      const middleware = requireRole('admin');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should redirect when user does not have the required role', () => {
      req.session.user = { id: 2, name: 'User', role_name: 'user' };

      const middleware = requireRole('admin');
      middleware(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'You do not have permission to access this page.');
      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(next).not.toHaveBeenCalled();
    });

    it('should redirect when user is not logged in', () => {
      const middleware = requireRole('admin');
      middleware(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'You must be logged in to access this page.');
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('processLoginForm', () => {
    it('should redirect to dashboard on successful login', async () => {
      const mockUser = { user_id: 1, name: 'Alice', email: 'alice@example.com', role_name: 'user' };
      const { authenticateUser } = await import('../../src/models/users.js');
      authenticateUser.mockResolvedValue(mockUser);

      req.body = { email: 'alice@example.com', password: 'password123' };
      res.locals = { NODE_ENV: 'production' };

      await processLoginForm(req, res);

      expect(req.session.user).toEqual(mockUser);
      expect(req.flash).toHaveBeenCalledWith('success', 'Logged in successfully.');
      expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to login on invalid credentials', async () => {
      const { authenticateUser } = await import('../../src/models/users.js');
      authenticateUser.mockResolvedValue(null);

      req.body = { email: 'wrong@example.com', password: 'wrong' };

      await processLoginForm(req, res);

      expect(req.flash).toHaveBeenCalledWith('error', 'Invalid email or password.');
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('processLogout', () => {
    it('should clear user session and redirect to home', async () => {
      req.session.user = { id: 1 };

      await processLogout(req, res);
      expect(req.session.user).toBeUndefined();
      expect(req.flash).toHaveBeenCalledWith('success', 'Logged out successfully.');
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should redirect to home even if no user is logged in', async () => {
      await processLogout(req, res);
      expect(req.flash).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });
});
