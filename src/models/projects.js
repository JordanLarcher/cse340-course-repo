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
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

    const result = await db.query(query, [id]);
    return result.rows;
}

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date AS date,
               o.name AS organization_name, o.organization_id
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
}

const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date AS date,
               o.name AS organization_name, o.organization_id
        FROM service_project p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}

export { getAllProjects, getSingleProject, getUpcomingProjects, getProjectDetails };
