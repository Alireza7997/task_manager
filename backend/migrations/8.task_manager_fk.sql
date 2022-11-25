-- +migrate Up
ALTER TABLE projects 
ADD CONSTRAINT fk_projects FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE tables 
ADD CONSTRAINT fk_tables FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks FOREIGN KEY (table_id) REFERENCES tables (id) ON DELETE CASCADE;
-- +migrate Down
ALTER TABLE projects
DROP CONSTRAINT fk_projects;

ALTER TABLE tables
DROP CONSTRAINT fk_tables;

ALTER TABLE tasks
DROP CONSTRAINT fk_tasks;