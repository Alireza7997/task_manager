-- +migrate Up
CREATE TABLE tables (
    id  SERIAL PRIMARY KEY UNIQUE,
    title varchar(64) NOT NULL,
    description varchar(200) NOT NULL,
    project_id INT NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
-- +migrate Down
DROP TABLE tables;