import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               o.name AS organization_name, o.organization_id
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getSingleProject = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               o.name AS organization_name, o.organization_id
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        where p.project_id = $1`;

    const result = await db.query(query, [id]);
    return result.rows;
}

export { getAllProjects, getSingleProject}
