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
    const query = `select * from category where category_id = $1`;
    const result = await db.query(query, [id]);
    return result.rows;
}

export { getAllCategories, getCategory }