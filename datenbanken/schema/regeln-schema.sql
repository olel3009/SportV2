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
    version INT DEFAULT 1,
    erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);