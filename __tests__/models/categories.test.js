import { jest, describe, beforeEach, expect, it } from '@jest/globals';

const mockQuery = jest.fn();

jest.unstable_mockModule('../../src/models/db.js', () => ({
  default: { query: mockQuery },
}));

const {
  getAllCategories,
  getCategory,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
  createCategory,
  updateCategory,
} = await import('../../src/models/categories.js');

describe('Categories Model', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { category_id: 1, name: 'Education' },
        { category_id: 2, name: 'Health' },
      ];
      mockQuery.mockResolvedValue({ rows: mockCategories });

      const categories = await getAllCategories();
      expect(categories).toEqual(mockCategories);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT category_id, name'));
    });
  });

  describe('getCategory', () => {
    it('should return a category by id', async () => {
      const mockCategory = { category_id: 1, name: 'Education' };
      mockQuery.mockResolvedValue({ rows: [mockCategory] });

      const category = await getCategory(1);
      expect(category).toEqual(mockCategory);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE category_id = $1'),
        [1]
      );
    });

    it('should return undefined when category not found', async () => {
      mockQuery.mockResolvedValue({ rows: [undefined] });

      const category = await getCategory(999);
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoriesByProjectId', () => {
    it('should return categories for a given project', async () => {
      const mockCategories = [{ category_id: 1, name: 'Education' }];
      mockQuery.mockResolvedValue({ rows: mockCategories });

      const categories = await getCategoriesByProjectId(10);
      expect(categories).toEqual(mockCategories);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('JOIN project_category'),
        [10]
      );
    });
  });

  describe('getProjectsByCategoryId', () => {
    it('should return projects for a given category', async () => {
      const mockProjects = [
        { project_id: 1, title: 'Tutoring', organization_name: 'Org1', organization_id: 5 },
      ];
      mockQuery.mockResolvedValue({ rows: mockProjects });

      const projects = await getProjectsByCategoryId(2);
      expect(projects).toEqual(mockProjects);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE pc.category_id = $1'),
        [2]
      );
    });
  });

  describe('createCategory', () => {
    it('should create a category and return the id', async () => {
      mockQuery.mockResolvedValue({ rows: [{ category_id: 5 }] });

      const id = await createCategory('New Category');
      expect(id).toBe(5);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO category'),
        ['New Category']
      );
    });

    it('should throw when no id is returned', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(createCategory('Bad')).rejects.toThrow('Failed to create category');
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      mockQuery.mockResolvedValue({ rows: [{ category_id: 1 }] });

      await updateCategory(1, 'Updated Name');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE category'),
        [1, 'Updated Name']
      );
    });

    it('should throw when category is not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(updateCategory(999, 'Ghost')).rejects.toThrow('Failed to update category');
    });
  });

  describe('updateCategoryAssignments', () => {
    it('should delete existing and insert new assignments', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await updateCategoryAssignments(10, [1, 2, 3]);

      expect(mockQuery).toHaveBeenCalledTimes(4);
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('DELETE FROM project_category'),
        [10]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO project_category'),
        [1, 10]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('INSERT INTO project_category'),
        [2, 10]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        4,
        expect.stringContaining('INSERT INTO project_category'),
        [3, 10]
      );
    });
  });
});
