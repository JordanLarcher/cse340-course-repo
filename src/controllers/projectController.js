import { 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject, 
    updateProject, 
    addUserAsAVolunteer, 
    removeUserAsAVolunteer, 
    getUserVolunteer 
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
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

        let isVolunteer = false;
        if(req.session.user){
            const userProjects = await getUserVolunteer(req.session.user.user_id);
            isVolunteer = userProjects.some(p => p.project_id == req.params.id);
        }
        res.render('project', { title: project.title, project, categories, isVolunteer });
        
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res, next) => {
    try {
        const title = 'Add New Service Project';
        const organizationList = await getAllOrganizations();
        res.render('new-project', { title, organizationList });
    } catch (error) {
        next(error);
    }
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

const showEditProjectForm = async (req, res, next) => {
    try {
        const project = await getProjectDetails(req.params.id);
        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        const organizationList = await getAllOrganizations();
        const title = 'Edit Service Project';
        res.render('edit-project', { title, project, organizationList });
    } catch (error) {
        next(error);
    }
}

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Project Updated Successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project', error);
        req.flash('error', 'Something went wrong while updating the project');
        res.redirect(`/edit-project/${projectId}`);
    }
}


const processUserVolunteer = async (req, res) => {

    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;
    try {
        await addUserAsAVolunteer(userId, projectId);
        req.flash('success', 'You have been added as a Volunteer!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding user as a volunteer', error);
        req.flash('error', 'Something went wrong while adding the user as a volunteer');
        res.redirect(`/project/${projectId}`);
    }
}

const processRemoveUserVolunteer = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;
    try {
        await removeUserAsAVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a Volunteer!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing user from volunteer', error);
        req.flash('error', 'Something went wrong while removing the user from volunteer');
        res.redirect(`/project/${projectId}`);
    }
}

export { 
    getProjectPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm, 
    processEditProjectForm, 
    processUserVolunteer,
    processRemoveUserVolunteer,
};