-- +migrate Up
CREATE TABLE projects (
    id  SERIAL PRIMARY KEY UNIQUE,
    name varchar(64) NOT NULL,
    user_id INT NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
);
--+ migrate Down
DROP TABLE projects;