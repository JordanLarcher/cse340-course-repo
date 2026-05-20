import {Router} from 'express';
import { getOrganizationsPage, showOrganizationDetailsPage } from "../controllers/organizationController.js";
import { getProjectPage, getProjectByID } from "../controllers/projectController.js";
import { getCategoryPage, getCategoryByID } from "../controllers/categoriesController.js";

const router = Router();

router.get('/', (req, res) => res.render('home', {title: 'Home'}));
router.get('/organizations', getOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', getProjectPage);
router.get('/projects/:id', getProjectByID);
router.get('/categories', getCategoryPage);
router.get('/categories/:id', getCategoryByID);

export default router;