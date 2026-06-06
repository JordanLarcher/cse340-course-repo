import {Router} from 'express';
import { processEditOrganizationForm, getOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, showEditOrganizationForm  } from "../controllers/organizationController.js";
import {
    getProjectPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
} from "../controllers/projectController.js";
import {
    getCategoryPage,
    getCategoryByID,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from "../controllers/categoriesController.js";
import { organizationValidation, validateForm, categoryValidation, validateCategoryForm } from "../middlewares/validationForm.js";
import { projectValidation, validateProjectForm } from "../middlewares/projectValidationForm.js";
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    processLoginForm, 
    showLoginForm, 
    processLogout, 
    requireLogin, 
    showDashboard} from "../controllers/usersController.js";
const router = Router();

router.get('/', (req, res) => res.render('home', {title: 'Home'}));
router.get('/organizations', getOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireLogin, showNewOrganizationForm );
router.get('/edit-organization/:id', requireLogin, showEditOrganizationForm);
router.post('/new-organization', requireLogin, organizationValidation, validateForm, processNewOrganizationForm);
router.put('/edit-organization/:id', requireLogin, organizationValidation, validateForm, processEditOrganizationForm);

router.get('/projects', getProjectPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, validateProjectForm, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, showEditProjectForm);
router.put('/edit-project/:id', requireLogin, projectValidation, validateProjectForm, processEditProjectForm);


// Routes to handle the assign categories to project form

router.get('/project/:projectId/assign-categories', requireLogin, showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, processAssignCategoriesForm);

router.get('/categories', getCategoryPage);
router.get('/category/:id', getCategoryByID);
router.get('/new-category', requireLogin, showNewCategoryForm);
router.post('/new-category', requireLogin, categoryValidation, validateCategoryForm, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, showEditCategoryForm);
router.put('/edit-category/:id', requireLogin, categoryValidation, validateCategoryForm, processEditCategoryForm);


// Routes to handle user registration and login
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);


router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.post('/logout', processLogout);


router.get('/dashboard', requireLogin, showDashboard);

export default router;