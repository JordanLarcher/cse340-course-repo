import { getUpcomingProjects, getProjectDetails} from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const getProjectPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        next(error);
    }
};


const showProjectDetailsPage = async (req, res, next) => {
    try {
        const project = await getProjectDetails(req.params.id);
        const categories = await getCategoriesByProjectId(req.params.id);
        res.render('project', { title: project.title, project, categories });
    } catch (error) {
        next(error);
    }
};


export { getProjectPage, showProjectDetailsPage}
