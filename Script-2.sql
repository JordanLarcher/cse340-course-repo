CREATE TABLE IF NOT EXISTS organizations (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description text NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS service_project (
   project_id SERIAL PRIMARY KEY,
   organization_id INTEGER NOT NULL,
   title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT null,
    CONSTRAINT fk_service_projects_org
    FOREIGN KEY (organization_id)
    REFERENCES organizations (organization_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_category(
  project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);
-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Insert sample data: service_projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
-- BrightFuture Builders (org 1)
(1, 'Park Bench Installation', 'Install new benches in downtown community parks', 'Downtown City Park', '2026-06-15'),
(1, 'School Playground Renovation', 'Renovate and upgrade playground equipment at Lincoln Elementary', 'Lincoln Elementary School', '2026-07-01'),
(1, 'Community Garden Shed', 'Build a storage shed for the community garden tools', 'Eastside Community Garden', '2026-07-20'),
(1, 'Sidewalk Repair Initiative', 'Repair cracked sidewalks in residential neighborhoods', 'Maple Street District', '2026-08-10'),
(1, 'Public Library Ramp', 'Construct an ADA-accessible ramp at the main library', 'City Central Library', '2026-08-25'),
-- GreenHarvest Growers (org 2)
(2, 'Urban Orchard Planting', 'Plant fruit trees in vacant urban lots', 'Riverside Neighborhood', '2026-06-10'),
(2, 'Farmers Market Setup', 'Set up weekly farmers market booths and signage', 'Downtown Plaza', '2026-06-28'),
(2, 'School Garden Workshop', 'Teach students how to start and maintain a vegetable garden', 'Washington Middle School', '2026-07-12'),
(2, 'Composting Program Launch', 'Launch a community composting program for residents', 'Greenway Community Center', '2026-08-05'),
(2, 'Rooftop Garden Installation', 'Install a rooftop garden on the community center', 'Hilltop Community Center', '2026-08-30'),
-- UnityServe Volunteers (org 3)
(3, 'Senior Center Meal Delivery', 'Deliver meals to homebound seniors weekly', 'Various locations', '2026-06-05'),
(3, 'Food Bank Sorting Event', 'Sort and organize donations at the regional food bank', 'Regional Food Bank Warehouse', '2026-06-22'),
(3, 'Beach Cleanup Day', 'Coordinate volunteers for a coastal beach cleanup', 'Sandy Shores Beach', '2026-07-10'),
(3, 'Winter Clothing Drive', 'Collect and distribute winter clothing to shelters', 'Downtown Collection Center', '2026-07-30'),
(3, 'Blood Donation Drive', 'Organize a community blood donation event', 'Community Health Center', '2026-08-20');

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Infrastructure'),
('Environment'),
('Community Service'),
('Education'),
('Health');