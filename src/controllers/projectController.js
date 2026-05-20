import { getUpcomingProjects, getProjectDetails} from "../models/projects.js";

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

const getProjectByID = async (req, res, next) => {
    try {
        const project = await getSingleProject(req.params.id);
        res.render('project', {
            title: 'Project',
            project
        });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const project = await getProjectDetails(req.params.id);
        res.render('project', {
            title: 'Project Details',
            project
        });
    } catch (error) {
        next(error);
    }
};


export { getProjectPage, getProjectByID, showProjectDetailsPage}
