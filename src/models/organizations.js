import db from './db.js';

const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM organizations;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getOrganizationsDetails = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM organizations
      WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllOrganizations, getOrganizationsDetails };