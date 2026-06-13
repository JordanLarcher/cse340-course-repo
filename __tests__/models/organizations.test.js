import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockQuery = jest.fn();

jest.unstable_mockModule('../../src/models/db.js', () => ({
  default: { query: mockQuery },
}));

const {
  getAllOrganizations,
  getOrganizationsDetails,
  createOrganization,
  updateOrganization,
} = await import('../../src/models/organizations.js');

describe('Organizations Model', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('getAllOrganizations', () => {
    it('should return all organizations', async () => {
      const mockOrgs = [
        { organization_id: 1, name: 'Org A', description: 'Desc A', contact_email: 'a@org.com', logo_filename: 'a.png' },
        { organization_id: 2, name: 'Org B', description: 'Desc B', contact_email: 'b@org.com', logo_filename: 'b.png' },
      ];
      mockQuery.mockResolvedValue({ rows: mockOrgs });

      const result = await getAllOrganizations();
      expect(result).toEqual(mockOrgs);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT organization_id'));
    });
  });

  describe('getOrganizationsDetails', () => {
    it('should return organization details by id', async () => {
      const mockOrg = { organization_id: 1, name: 'Org A', description: 'Desc A', contact_email: 'a@org.com', logo_filename: 'a.png' };
      mockQuery.mockResolvedValue({ rows: [mockOrg] });

      const result = await getOrganizationsDetails(1);
      expect(result).toEqual(mockOrg);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE organization_id = $1'),
        [1]
      );
    });

    it('should return null when organization not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await getOrganizationsDetails(999);
      expect(result).toBeNull();
    });
  });

  describe('createOrganization', () => {
    it('should create an organization and return the id', async () => {
      mockQuery.mockResolvedValue({ rows: [{ organization_id: 10 }] });

      const id = await createOrganization('New Org', 'Description', 'email@org.com', 'logo.png');
      expect(id).toBe(10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO organizations'),
        ['New Org', 'Description', 'email@org.com', 'logo.png']
      );
    });

    it('should throw when no id is returned', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(createOrganization('Fail', 'Desc', 'e@e.com', 'l.png'))
        .rejects.toThrow('Failed to create organization');
    });
  });

  describe('updateOrganization', () => {
    it('should update an organization', async () => {
      mockQuery.mockResolvedValue({ rows: [{ organization_id: 1 }] });

      await updateOrganization(1, 'Updated Name', 'Updated Desc', 'new@email.com', 'new-logo.png');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE organizations'),
        [1, 'Updated Name', 'Updated Desc', 'new@email.com', 'new-logo.png']
      );
    });

    it('should throw when organization is not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(updateOrganization(999, 'Ghost', 'Desc', 'g@g.com', 'g.png'))
        .rejects.toThrow('Failed to create organization');
    });
  });
});
