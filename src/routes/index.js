import {Router} from 'express';
import { getOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm } from "../controllers/organizationController.js";
import { getProjectPage, showProjectDetailsPage } from "../controllers/projectController.js";
import { getCategoryPage, getCategoryByID } from "../controllers/categoriesController.js";

const router = Router();

router.get('/', (req, res) => res.render('home', {title: 'Home'}));
router.get('/organizations', getOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm );


router.get('/projects', getProjectPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', getCategoryPage);
router.get('/category/:id', getCategoryByID);

export default router;