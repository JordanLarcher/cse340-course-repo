import { getAllOrganizations, getOrganizationsDetails, createOrganization, updateOrganization } from "../models/organizations.js";
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
    try {
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
    } catch (error) {
        next(error);
    }
};

const showNewOrganizationForm = async (req, res, next) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};


const processNewOrganizationForm = async (req, res, next) => {
    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

        req.flash('success', 'Organization Created Successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationsDetails(organizationId);

        const title = 'Edit Organization';
        res.render('edit-organization', { title, organizationDetails });
    } catch (error) {
        next(error);
    }
}

const processEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

        req.flash('success', 'Organization Updated Successfully!');
        return res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
}



export { processEditOrganizationForm, showEditOrganizationForm, getOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm };

