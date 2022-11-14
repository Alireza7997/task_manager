-- +migrate Up
CREATE TABLE tasks (
    id  SERIAL PRIMARY KEY UNIQUE,
    name varchar(64) NOT NULL,
    description varchar(1000) NOT NULL,
    done    BOOLEAN NOT NULL,
    table_id INT NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
-- +migrate Down
DROP TABLE tasks;