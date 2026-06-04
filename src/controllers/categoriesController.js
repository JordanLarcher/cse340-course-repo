import {
    getAllCategories,
    getCategory,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId
} from "../models/categories.js";
import {getProjectDetails} from "../models/projects.js";

const getCategoryPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', {
            title: 'Categories',
            categories
        });
    } catch (error) {
        next(error);
    }
}

const getCategoryByID = async (req, res, next) => {
    const categoryId = req.params.id;
    try{
        const category = await getCategory(categoryId);
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        const projects = await getProjectsByCategoryId(categoryId);
        res.render('category', {title: category.name, category, projects});
    }catch (error){
        next(error);
    }
}

const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
}

const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds]
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully');
    res.redirect(`/project/${projectId}`);
}

export { getCategoryPage, getCategoryByID, processAssignCategoriesForm, showAssignCategoriesForm };
