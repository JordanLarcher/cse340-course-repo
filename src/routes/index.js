import {Router} from 'express';
import { 
    processEditOrganizationForm, 
    getOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    showEditOrganizationForm  
} from "../controllers/organizationController.js";
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
import { 
    organizationValidation, 
    validateForm, 
    categoryValidation, 
    validateCategoryForm 
} from "../middlewares/validationForm.js";
import { 
    projectValidation, 
    validateProjectForm 
} from "../middlewares/projectValidationForm.js";
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    processLoginForm, 
    showLoginForm, 
    processLogout, 
    requireLogin, 
    showDashboard,
    requireRole,
    showUsersList
} from "../controllers/usersController.js";
const router = Router();

router.get('/', (req, res) => res.render('home', {title: 'Home'}));
router.get('/organizations', getOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm );
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidation, validateForm, processNewOrganizationForm);
router.put('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidation, validateForm, processEditOrganizationForm);

router.get('/projects', getProjectPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, validateProjectForm, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.put('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, validateProjectForm, processEditProjectForm);


// Routes to handle the assign categories to project form

router.get('/project/:projectId/assign-categories', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, requireRole('admin'), processAssignCategoriesForm);

router.get('/categories', getCategoryPage);
router.get('/category/:id', getCategoryByID);
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidation, validateCategoryForm, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.put('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, validateCategoryForm, processEditCategoryForm);


// Routes to handle user registration and login
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);


router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.post('/logout', processLogout);


router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, requireRole('admin'), showUsersList);

export default router;