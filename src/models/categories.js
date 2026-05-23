import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
      FROM category;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getCategory = async (id) => {
    const query = `SELECT * FROM category WHERE category_id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
    SELECT c.category_id, c.name
    FROM category c
    JOIN project_category pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
    SELECT 
    sp.project_id,
    sp.title,
    sp.description,
    sp.location,
    sp.project_date,
    o.name AS organization_name,
    o.organization_id
    FROM service_project sp
    JOIN project_category pc ON sp.project_id = pc.project_id
    JOIN organizations o ON sp.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY sp.project_date
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export { getAllCategories, getCategory, getCategoriesByProjectId, getProjectsByCategoryId };