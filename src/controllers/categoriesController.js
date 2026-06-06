import {
    getAllCategories,
    getCategory,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId,
    createCategory,
    updateCategory
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
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);
        const title = 'Assign Categories to Project';

        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
    } catch (error) {
        next(error);
    }
}

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds]
        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
}

const showNewCategoryForm = async (req, res, next) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
}

const processNewCategoryForm = async (req, res) => {
    const { name } = req.body;

    try {
        const categoryId = await createCategory(name);
        req.flash('success', 'Category Created Successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error creating category', error);
        req.flash('error', 'Something went wrong while creating the category');
        res.redirect('/new-category');
    }
}

const showEditCategoryForm = async (req, res, next) => {
    try {
        const category = await getCategory(req.params.id);
        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        const title = 'Edit Category';
        res.render('edit-category', { title, category });
    } catch (error) {
        next(error);
    }
}

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category Updated Successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category', error);
        req.flash('error', 'Something went wrong while updating the category');
        res.redirect(`/edit-category/${categoryId}`);
    }
}

export { getCategoryPage, getCategoryByID, processAssignCategoriesForm, showAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm };
