CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES public.organization(organization_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

INSERT INTO public.project (organization_id, title, description, location, date) VALUES
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
