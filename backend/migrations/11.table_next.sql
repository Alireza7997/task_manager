-- +migrate Up
ALTER TABLE tables
ADD COLUMN  next INT;

-- +migrate Down
ALTER TABLE tables
DROP COLUMN next;