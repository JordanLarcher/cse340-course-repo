import {Router} from 'express';
import { processEditOrganizationForm, getOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, showEditOrganizationForm  } from "../controllers/organizationController.js";
import {
    getProjectPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
} from "../controllers/projectController.js";
import {
    getCategoryPage,
    getCategoryByID,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from "../controllers/categoriesController.js";
import { organizationValidation, validateForm } from "../middlewares/validationForm.js";
import { projectValidation, validateProjectForm } from "../middlewares/projectValidationForm.js";
const router = Router();

router.get('/', (req, res) => res.render('home', {title: 'Home'}));
router.get('/organizations', getOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm );
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/new-organization', organizationValidation, validateForm, processNewOrganizationForm);
router.put('/edit-organization/:id', organizationValidation, validateForm, processEditOrganizationForm);

router.get('/projects', getProjectPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, validateProjectForm, processNewProjectForm);


// Routes to handle the assign categories to project form

router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/categories', getCategoryPage);
router.get('/category/:id', getCategoryByID);

export default router;