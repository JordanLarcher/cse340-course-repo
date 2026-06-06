import { body, validationResult } from "express-validator";

const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];


const validateForm = async (req, res, next ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        const redirectUrl = req.path.startsWith('/edit-organization')
            ? req.path
            : '/new-organization';
        return res.redirect(redirectUrl);
    }

    next();
}


const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Category name must be between 2 and 100 characters')
];

const validateCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        const redirectUrl = req.path.startsWith('/edit-category')
            ? req.path
            : '/new-category';
        return res.redirect(redirectUrl);
    }

    next();
}

export { organizationValidation, validateForm, categoryValidation, validateCategoryForm };