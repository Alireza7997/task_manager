-- +migrate Up
ALTER TABLE sessions 
ADD CONSTRAINT fk_session_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
-- +migrate Down
ALTER TABLE sessions
DROP CONSTRAINT fk_session_id;