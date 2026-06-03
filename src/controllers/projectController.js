import { getUpcomingProjects, getProjectDetails, createProject} from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import {createOrganization, getAllOrganizations} from "../models/organizations.js";

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

const showNewProjectForm = async (req, res, next) => {
    const title = 'Add New Service Project';
    const organizationList = await getAllOrganizations();
    res.render('new-project', { title, organizationList });
}

const processNewProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;

    try {
        const projectId = await createProject( title, description, location, date, organizationId );

        // this sets the success flash message
        req.flash('success', 'Project Created Successfully!');
        res.redirect(`/project/${projectId}`);
    } catch(error) {
        console.error('Error creating new service project', error);
        req.flash('error', 'Something went wrong while creating the new service project');
        res.redirect('/new-project');
    }
};

export { getProjectPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };