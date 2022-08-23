-- +migrate Up
CREATE TABLE users (
    id  SERIAL UNIQUE PRIMARY KEY,
    username    varchar(64) UNIQUE NOT NULL,
    password    varchar(100) NOT NULL,
    email   varchar(320) NOT NULL,
    created_at  TIMESTAMP NOT NULL
);
-- +migrate Down
DROP TABLE users;