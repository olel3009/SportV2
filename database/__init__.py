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
    
    from api.routes.athlete import bp_athlete
    from api.routes.user import bp_user
    from api.routes.trainer import bp_trainer
    from api.routes.result import bp_result 
    from api.routes.rule import bp_rule
    
    for bp in [bp_user, bp_trainer, bp_result, bp_athlete, bp_rule]:
        app.register_blueprint(bp)
    
    return app