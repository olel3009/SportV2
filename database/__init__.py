import os
from marshmallow import ValidationError
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from api.logs.logger import logger
from flask_jwt_extended import JWTManager  # JWTManager importieren


# Initialisiere Extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()  # JWTManager-Instanz erstellen

def create_app():
    # Flask-App erstellen
    app = Flask(__name__)

    # wo die Dateien abgelegt werden
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Config
    app.config['ALLOWED_IMAGE_EXTS'] = {'png', 'jpg', 'jpeg', 'gif'}
    app.config['ALLOWED_CERT_EXTS']  = {'pdf', 'png', 'jpg', 'jpeg'}
    app.config['PDF_TEMPLATE_PATH']  = r'api/data/DSA_Einzelpruefkarte_2025_SCREEN.pdf'
    app.config['PDF_OUTPUT_FOLDER'] = rf"api/pdfs/"
    os.makedirs(app.config['PDF_OUTPUT_FOLDER'], exist_ok=True)

    
    # Konfiguration laden
    app.config.from_object('config.Config')
    app.config["JWT_SECRET_KEY"] = "dein_geheimer_schluessel"  # JWT-Secret setzen

    # Extensions initialisieren
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)  # JWTManager initialisieren
    
    from api.routes.athlete import bp_athlete
    from api.routes.user import bp_user
    from api.routes.trainer import bp_trainer
    from api.routes.result import bp_result 
    from api.routes.rule import bp_rule
    from api.routes.discipline import bp_discipline
    #from api.routes.group import bp_group
    from api.routes.athlete_pdf import bp_athlete_pdf
    
    for bp in [bp_user, bp_trainer, bp_result, bp_athlete, bp_rule, bp_discipline, bp_athlete_pdf]:
        app.register_blueprint(bp)

    @app.errorhandler(ValidationError)
    def handle_validation_error(err):
        return jsonify({
            "error": "Validation Error",
            "messages": err.messages
        }), 400
    
    logger.info("App mittels Blueprints erforlgreich erstellt!")
    return app
