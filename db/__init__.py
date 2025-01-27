from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialisiere Extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Flask-App erstellen
    app = Flask(__name__)
    
    # Konfiguration laden
    app.config.from_object('config.Config')

    # Extensions initialisieren
    db.init_app(app)
    migrate.init_app(app, db)

    # Blueprint oder Routen registrieren
    from app.routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    return app