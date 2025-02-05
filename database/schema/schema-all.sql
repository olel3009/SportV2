-- Trainer Tabelle
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('m', 'f', 'd') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Athleten Tabelle
CREATE TABLE athletes (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('m', 'f', 'd') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ergebnisse Tabelle
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

-- Regeln Tabelle
CREATE TABLE regeln (
    id SERIAL PRIMARY KEY,
    reglename VARCHAR(255) NOT NULL,
    beschreibung TEXT,
    disziplin VARCHAR(50),
    strecke INT NOT NULL,
    zeit_in_sekunden INT NOT NULL,
    punkte INT NOT NULL,
    gueltig_ab DATE NOT NULL,
    gueltig_bis DATE,
    version INT DEFAULT 1 NOT NULL,
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);