-- +migrate Up
ALTER TABLE tasks
ADD COLUMN next INT;

-- +migrate Down
ALTER TABLE tasks
DROP COLUMN next