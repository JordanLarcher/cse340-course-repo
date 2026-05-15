import { getAllOrganizations } from "../models/organizations.js";
const getOrganizationsPage = async (req, res, next) => {
    try{
        const organizations = await getAllOrganizations();
        const title = "Our Partner Organizations"
        res.render('organizations', {title, organizations});
    }catch (error){
        next(error);
    }
};


export { getOrganizationsPage };