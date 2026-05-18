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
    return await db.query(query, [id]);
}

export { getAllCategories, getCategory }