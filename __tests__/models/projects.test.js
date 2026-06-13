import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockQuery = jest.fn();

jest.unstable_mockModule('../../src/models/db.js', () => ({
  default: { query: mockQuery },
}));

const {
  getAllProjects,
  getProjectByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
} = await import('../../src/models/projects.js');

describe('Projects Model', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('getAllProjects', () => {
    it('should return all projects ordered by date', async () => {
      const mockProjects = [
        { project_id: 1, title: 'Project A', organization_name: 'Org A', organization_id: 1 },
        { project_id: 2, title: 'Project B', organization_name: 'Org B', organization_id: 2 },
      ];
      mockQuery.mockResolvedValue({ rows: mockProjects });

      const result = await getAllProjects();
      expect(result).toEqual(mockProjects);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('ORDER BY p.project_date'));
    });
  });

  describe('getProjectByOrganizationId', () => {
    it('should return projects for a given organization', async () => {
      const mockProjects = [
        { project_id: 1, title: 'Project A', organization_id: 5 },
      ];
      mockQuery.mockResolvedValue({ rows: mockProjects });

      const result = await getProjectByOrganizationId(5);
      expect(result).toEqual(mockProjects);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE organization_id = $1'),
        [5]
      );
    });
  });

  describe('getUpcomingProjects', () => {
    it('should return upcoming projects with limit', async () => {
      const mockProjects = [
        { project_id: 1, title: 'Future Project', date: '2026-07-01', organization_name: 'Org', organization_id: 1 },
      ];
      mockQuery.mockResolvedValue({ rows: mockProjects });

      const result = await getUpcomingProjects(5);
      expect(result).toEqual(mockProjects);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE p.project_date >= CURRENT_DATE'),
        [5]
      );
    });
  });

  describe('getProjectDetails', () => {
    it('should return project details by id', async () => {
      const mockProject = { project_id: 1, title: 'Project A', date: '2026-06-15', organization_name: 'Org', organization_id: 1 };
      mockQuery.mockResolvedValue({ rows: [mockProject] });

      const result = await getProjectDetails(1);
      expect(result).toEqual(mockProject);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE p.project_id = $1'),
        [1]
      );
    });

    it('should return undefined when project not found', async () => {
      mockQuery.mockResolvedValue({ rows: [undefined] });

      const result = await getProjectDetails(999);
      expect(result).toBeUndefined();
    });
  });

  describe('createProject', () => {
    it('should create a project and return the id', async () => {
      mockQuery.mockResolvedValue({ rows: [{ project_id: 42 }] });

      const id = await createProject('Title', 'Description', 'Location', '2026-07-01', 1);
      expect(id).toBe(42);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO service_project'),
        ['Title', 'Description', 'Location', '2026-07-01', 1]
      );
    });

    it('should throw when no id is returned', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(createProject('T', 'D', 'L', '2026-07-01', 1))
        .rejects.toThrow('Failed to create project');
    });
  });

  describe('updateProject', () => {
    it('should update a project', async () => {
      mockQuery.mockResolvedValue({ rows: [{ project_id: 1 }] });

      await updateProject(1, 'Updated Title', 'Updated Desc', 'New Loc', '2026-08-01', 2);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE service_project'),
        [1, 'Updated Title', 'Updated Desc', 'New Loc', '2026-08-01', 2]
      );
    });

    it('should throw when project is not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(updateProject(999, 'Ghost', 'Desc', 'Loc', '2026-01-01', 1))
        .rejects.toThrow('Failed to update project');
    });
  });
});
