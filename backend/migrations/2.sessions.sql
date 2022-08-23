-- +migrate Up
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    session_id varchar(255) UNIQUE NOT NULL,
    expiry TIMESTAMP NOT NULL
);
-- +migrate Down
DROP TABLE sessions;