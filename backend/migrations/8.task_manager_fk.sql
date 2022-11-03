-- +migrate Up
ALTER TABLE projects 
ADD CONSTRAINT fk_projects FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE tables 
ADD CONSTRAINT fk_tables FOREIGN KEY (project_id) REFERENCES projects (id);

ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks FOREIGN KEY (table_id) REFERENCES tables (id);
-- +migrate Down
ALTER TABLE sessions
DROP CONSTRAINT fk_projects;
DROP CONSTRAINT fk_tables;
DROP CONSTRAINT fk_tasks;