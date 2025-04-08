# SPORTV2 (Working name)
Managementtool zur Leistsungserfassung von Athleten

# Setup
## Simples Virtuel Environment
Erstellen:
- python -m venv venv  

Aktievierbar durch:
- Windows: .\venv\Scripts\activate
- Linux: ./venv/bin/activate.sh  

Pakete installieren:
- pip install -r requirements.txt

## Starten des Backends & DB
- Virtuelles Environment erstellen und/oder aktivieren
- flask --app database/migrate.py run
- Nach erfolgreichem Migrieren mit `Strg + C` abbrechen.
- flask --app run.py run

## Starten des Frontends
- cd /frontend
- npm i --force
- npm run dev