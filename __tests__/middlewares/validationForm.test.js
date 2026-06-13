import {beforeEach, describe, expect, it, jest} from '@jest/globals';

let mockValidationResult;

jest.unstable_mockModule('express-validator', () => ({
  body: () => {
    const middleware = (req, res, next) => next();
    middleware.trim = () => middleware;
    middleware.notEmpty = () => middleware;
    middleware.withMessage = () => middleware;
    middleware.isLength = () => middleware;
    middleware.normalizeEmail = () => middleware;
    middleware.isEmail = () => middleware;
    middleware.isInt = () => middleware;
    middleware.isISO8601 = () => middleware;
    middleware.bail = () => middleware;
    return middleware;
  },
  validationResult: () => mockValidationResult,
}));

const {
  organizationValidation,
  validateForm,
  categoryValidation,
  validateCategoryForm,
} = await import('../../src/middlewares/validationForm.js');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      flash: jest.fn(),
      path: '/new-organization',
      body: {},
    };
    res = { redirect: jest.fn() };
    next = jest.fn();
  });

  describe('validateForm', () => {
    it('should call next when there are no validation errors', async () => {
      mockValidationResult = {
        isEmpty: () => true,
        array: () => [],
      };

      await validateForm(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should flash errors and redirect on validation failure', async () => {
      mockValidationResult = {
        isEmpty: () => false,
        array: () => [
          { msg: 'Name is required' },
          { msg: 'Email is invalid' },
        ],
      };

      await validateForm(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Name is required');
      expect(req.flash).toHaveBeenCalledWith('error', 'Email is invalid');
      expect(res.redirect).toHaveBeenCalledWith('/new-organization');
      expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to edit path when path starts with /edit-organization', async () => {
      req.path = '/edit-organization/5';
      mockValidationResult = {
        isEmpty: () => false,
        array: () => [{ msg: 'Error' }],
      };

      await validateForm(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/edit-organization/5');
    });
  });

  describe('validateCategoryForm', () => {
    it('should call next when there are no validation errors', async () => {
      mockValidationResult = {
        isEmpty: () => true,
        array: () => [],
      };

      await validateCategoryForm(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should flash errors and redirect on validation failure', async () => {
      mockValidationResult = {
        isEmpty: () => false,
        array: () => [{ msg: 'Category name is required' }],
      };

      await validateCategoryForm(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Category name is required');
      expect(res.redirect).toHaveBeenCalledWith('/new-category');
    });

    it('should redirect to edit path when path starts with /edit-category', async () => {
      req.path = '/edit-category/3';
      mockValidationResult = {
        isEmpty: () => false,
        array: () => [{ msg: 'Error' }],
      };

      await validateCategoryForm(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/edit-category/3');
    });
  });

  describe('validation rule arrays', () => {
    it('should export organization validation rules', () => {
      expect(Array.isArray(organizationValidation)).toBe(true);
      expect(organizationValidation.length).toBeGreaterThan(0);
    });

    it('should export category validation rules', () => {
      expect(Array.isArray(categoryValidation)).toBe(true);
      expect(categoryValidation.length).toBeGreaterThan(0);
    });
  });
});
