import { getAllCategories, getCategory } from "../models/categories.js";

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
        res.render('category', {title:'Category', category});
    }catch (error){
        next(error);
    }
}

export { getCategoryPage, getCategoryByID }
