import { getAllProjects } from "../models/projects.js";

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
}

export { getProjectPage }
