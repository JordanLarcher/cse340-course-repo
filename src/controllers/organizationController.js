import { getAllOrganizations, getOrganizationsDetails } from "../models/organizations.js";
import { getProjectByOrganizationId } from "../models/projects.js";


const getOrganizationsPage = async (req, res, next) => {
    try{
        const organizations = await getAllOrganizations();
        const title = "Our Partner Organizations"
        res.render('organizations', {title, organizations});
    }catch (error){
        next(error);
    }
};

const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationsDetails(organizationId);
    const projects = await getProjectByOrganizationId(organizationId);
    const title = 'Organization Details';
    if (!organizationDetails) {
        const err = new Error('Organization not found');
        err.status = 404;
        return next(err);
    }
    res.render('organization', { title, organizationDetails, projects });
};

const showNewOrganizationForm = async (req, res, next) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};


export { getOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm };