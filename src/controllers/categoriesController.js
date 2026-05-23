import { getAllCategories, getCategory, getProjectsByCategoryId } from "../models/categories.js";

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

export { getCategoryPage, getCategoryByID };
