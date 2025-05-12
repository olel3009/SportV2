# schema.py
from marshmallow import Schema, fields, validates, ValidationError, validates_schema
from marshmallow.validate import Length, OneOf, Range
from datetime import datetime

# Trainer-Schema
class TrainerSchema(Schema):
    first_name = fields.Str(required=True, validate=Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=Length(min=1, max=100))
    email = fields.Email(required=True)  # Gültige E-Mail
    birth_date = fields.Date(required=True, format="%d,%m,%Y")
    gender = fields.Str(required=True, validate=OneOf(["m", "f", "d"]))


# Athlete-Schema
class AthleteSchema(Schema):
    first_name = fields.Str(required=True, validate=Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=Length(min=1, max=100))
    birth_date = fields.Date(required=True, format="%d,%m,%Y")
    gender = fields.Str(required=True, validate=OneOf(["m", "f", "d"]))
    swim_certificate = fields.Bool(missing=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


# Result-Schema
class ResultSchema(Schema):
    # ID nur ausgeben, nicht vom Client annehmen
    id = fields.Int(dump_only=True)

    # Fremdschlüssel
    athlete_id = fields.Int(required=True)
    rule_id = fields.Int(required=True)

    # Jahr der Prüfung
    year = fields.Int(required=True, validate=Range(min=1900, max=2100))

    # Alter wird intern berechnet (year - athlete.birth_year),
    age = fields.Int(dump_only=True)

    result = fields.Float(required=True, validate=Range(min=0))

    medal = fields.Str(
        required=False,
        allow_none=True,
        validate=OneOf(["Bronze", "Silber", "Gold"]),
        missing=None
    )

    # Zeitstempel nur zum Ausgeben
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

# Discplin-Schema
class DisciplineSchema(Schema):
    id = fields.Int(dump_only=True)

    discipline_name = fields.Str(
        required=True,
        validate=OneOf(["Ausdauer", "Kraft", "Schnelligkeit", "Koordination"])
    )

    # Timestamps nur zum Ausgeben
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

# Rule-Schema
class RuleSchema(Schema):
    id = fields.Int(dump_only=True)

    discipline_id = fields.Int(required=True)

    rule_name = fields.Str(
        required=True,
        validate=Length(min=1, max=255)
    )

    description_m = fields.Str(
        required=True,
        validate=Length(min=1, max=255)
    )

    description_f = fields.Str(
        required=True,
        validate=Length(min=1, max=255)
    )

    unit = fields.Str(
        required=True,
        validate=OneOf(["Punkte", "Distanz (m,cm)", "Zeit (Min.,Sek.)", "Zeit (Sek.,1/10 Sek.)"])
    )

    min_age = fields.Int(
        required=True,
        validate=Range(min=0)  # z. B. kein negatives Alter
    )
    max_age = fields.Int(
        required=True,
        validate=Range(min=0)
    )

    # Thresholds für Bronze/Silber/Gold (männlich)
    threshold_bronze_m = fields.Float(required=True, validate=Range(min=0))
    threshold_silver_m = fields.Float(required=True, validate=Range(min=0))
    threshold_gold_m = fields.Float(required=True, validate=Range(min=0))

    # Thresholds für Bronze/Silber/Gold (weiblich)
    threshold_bronze_f = fields.Float(required=True, validate=Range(min=0))
    threshold_silver_f = fields.Float(required=True, validate=Range(min=0))
    threshold_gold_f = fields.Float(required=True, validate=Range(min=0))

    valid_start = fields.Date(required=True, format="%d,%m,%Y")
    valid_end = fields.Date(required=False, allow_none=True, format="%d,%m,%Y")

    # Version startet mit 1, wenn nicht angegeben
    version = fields.Int(missing=1)

    # Timestamps nur zum Ausgeben
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates_schema
    def validate_data(self, data, **kwargs):
        """
        - valid_end darf nicht vor valid_start liegen (falls valid_end vorhanden).
        - min_age darf nicht größer als max_age sein.
        """
        if data.get("valid_end") and data.get("valid_start") and data["valid_end"] < data["valid_start"]:
            raise ValidationError("valid_end kann nicht vor valid_start sein.")

        if data.get("max_age") and data.get("min_age") and data["min_age"] > data["max_age"]:
            raise ValidationError("min_age kann nich größer als max_age.")
        
# User-Schema
class UserSchema(Schema):
    email = fields.Str(required=True, validate=Length(max=255))
    password = fields.Str(required=True, validate=Length(max=255))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates("email")
    def validate_email(self, value):
        if "@" not in value:
            raise ValidationError("E-Mail muss ein '@' enthalten")
