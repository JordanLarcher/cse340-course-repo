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
  projectValidation,
  validateProjectForm,
} = await import('../../src/middlewares/projectValidationForm.js');

describe('Project Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      flash: jest.fn(),
      path: '/new-project',
      body: {},
    };
    res = { redirect: jest.fn() };
    next = jest.fn();
  });

  describe('validateProjectForm', () => {
    it('should call next when there are no validation errors', async () => {
      mockValidationResult = {
        isEmpty: () => true,
        array: () => [],
      };

      await validateProjectForm(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should flash errors and redirect on validation failure', async () => {
      mockValidationResult = {
        isEmpty: () => false,
        array: () => [{ msg: 'Title is required' }],
      };

      await validateProjectForm(req, res, next);
      expect(req.flash).toHaveBeenCalledWith('error', 'Title is required');
      expect(res.redirect).toHaveBeenCalledWith('/new-project');
      expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to edit path when path starts with /edit-project', async () => {
      req.path = '/edit-project/10';
      mockValidationResult = {
        isEmpty: () => false,
        array: () => [{ msg: 'Error' }],
      };

      await validateProjectForm(req, res, next);
      expect(res.redirect).toHaveBeenCalledWith('/edit-project/10');
    });
  });

  describe('projectValidation rules', () => {
    it('should export project validation rules', () => {
      expect(Array.isArray(projectValidation)).toBe(true);
      expect(projectValidation.length).toBeGreaterThan(0);
    });
  });
});
