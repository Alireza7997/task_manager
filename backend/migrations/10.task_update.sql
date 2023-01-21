-- +migrate Up
ALTER TABLE tasks 
ADD COLUMN due_date VARCHAR(10),
ADD COLUMN start_date VARCHAR(10),
ADD COLUMN finish_date VARCHAR(10);

-- +migrate Down
ALTER TABLE tasks
DROP COLUMN due_date,
DROP COLUMN start_date,
DROP COLUMN finish_date;