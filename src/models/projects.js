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

const getProjectByOrganizationId = async (id) => {
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


const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if(process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID: ', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_project SET
            title = $2,
            description = $3,
            location = $4,
            project_date = $5,
            organization_id = $6
        WHERE project_id = $1
        RETURNING project_id;
    `;
    const queryParams = [id, title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }
}


const addUserAsAVolunteer = async (user_id, project_id) => { 
    const query = `
        INSERT INTO user_project (user_id, project_id)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const queryParams = [user_id, project_id];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to insert user as a volunteer');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('User added as a volunteer for project with ID:', result.rows[0].project_id);
    }

    return result.rows[0];
}

const removeUserAsAVolunteer = async (user_id, project_id) => { 
    const query = `
        DELETE FROM user_project
        WHERE user_id = $1 AND project_id = $2
    `;

    const queryParams = [user_id, project_id];
    const result = await db.query(query,queryParams);

    if (result.rowCount === 0) {
        throw new Error('Failed to remove user from volunteer');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('User removed as a volunteer for project with ID:', result.rowCount);
    }
}

const getUserVolunteer = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date AS date,
        o.name AS organization_name
        FROM user_project up
        JOIN service_project p ON up.project_id = p.project_id
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE up.user_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows;
}

export { 
    getAllProjects, 
    getProjectByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject, 
    updateProject,
    addUserAsAVolunteer,
    removeUserAsAVolunteer,
    getUserVolunteer    
};
