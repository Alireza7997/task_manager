-- +migrate Up
CREATE TABLE tokens (
    token varchar(1000) NOT NULL UNIQUE
);

-- +migrate Down
DROP TABLE tokens;