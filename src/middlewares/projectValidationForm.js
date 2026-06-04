import { body, validationResult } from "express-validator";

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project name must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({min: 3, max: 200})
        .withMessage('Project location cannot exceed 200 characters'),
    body('date')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Project date must be a valid date format'),
    body('organizationId')
        .notEmpty()
        .withMessage('Project organizationId is required')
        .isInt()
        .withMessage('Project organizationId must be a number')
];


const validateProjectForm = async (req, res, next ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    next();
}


export { projectValidation, validateProjectForm };