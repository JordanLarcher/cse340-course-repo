import { getAllProjects, getSingleProject } from "../models/projects.js";

const getProjectPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', {
            title: 'Projects',
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
}


export { getProjectPage, getProjectByID}
