CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    athlete_id INT NOT NULL,
    year INT NOT NULL,
    age INT NOT NULL,
    result FLOAT NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);