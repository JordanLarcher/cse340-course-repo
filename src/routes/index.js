import {Router} from 'express';
import { getOrganizationsPage } from "../controllers/organizationController.js";
import { getProjectPage } from "../controllers/projectController.js";

const router = Router();

router.get('/', (req, res) => res.render('home', {title: 'Home'}));
router.get('/organizations', getOrganizationsPage);
router.get('/projects', getProjectPage);

export default router;