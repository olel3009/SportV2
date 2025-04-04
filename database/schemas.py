# schema.py
from marshmallow import Schema, fields, validates, ValidationError, validates_schema
from marshmallow.validate import Length, OneOf, Range
from datetime import datetime

# Trainer-Schema
class TrainerSchema(Schema):
    first_name = fields.Str(required=True, validate=Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=Length(min=1, max=100))
    email = fields.Email(required=True)  # Gültige E-Mail
    birth_date = fields.Date(required=True, format="%d-%m-%Y")
    gender = fields.Str(required=True, validate=OneOf(["m", "f", "d"]))


# Athlete-Schema
class AthleteSchema(Schema):
    first_name = fields.Str(required=True, validate=Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=Length(min=1, max=100))
    birth_date = fields.Date(required=True, format="%d-%m-%Y")
    gender = fields.Str(required=True, validate=OneOf(["m", "f", "d"]))
    swim_certificate = fields.Bool(missing=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


# Result-Schema
class ResultSchema(Schema):
    athlete_id = fields.Int(required=True)              # FK auf Athlete
    year = fields.Int(required=True, validate=Range(min=1900, max=2100))
    age = fields.Int(required=True, validate=Range(min=1, max=120))
    disciplin = fields.Str(required=True, validate=Length(min=1, max=255))
    result = fields.Str(required=True, validate=Length(min=1, max=100))
    points = fields.Int(required=True, validate=Range(min=1, max=3))
    medal = fields.Str(required=True, validate=OneOf(["Bronze", "Silber", "Gold"]))
    version = fields.Int(missing=1)  
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

# Discplin-Schema
class DisciplineSchema(Schema):
    id = fields.Int(dump_only=True)

    # Beispiel: "Endurance", "Strength", "Speed", "Coordination" etc.
    group_name = fields.Str(
        required=True,
        validate=Length(min=1, max=255)
    )

    # Beispiel: "Running", "Swimming", "Cycling" etc.
    discipline_name = fields.Str(
        required=True,
        validate=Length(min=1, max=255)
    )

    # Kann 'points', 'distance', 'time' oder 'amount' sein
    unit = fields.Str(
        required=True,
        validate=OneOf(["points", "distance", "time", "amount"])
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

    action = fields.Str(
        required=True,
        validate=Length(min=1, max=255)
    )

    valid_start = fields.Date(required=True, format="%Y-%m-%d")
    valid_end = fields.Date(required=False, allow_none=True, format="%Y-%m-%d")

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
    email = fields.Str(required=True, validate=Length(min=5, max=255))
    password = fields.Str(required=True, validate=Length(min=8, max=255))
    trainer_id = fields.Int(required=False, allow_none=True)
    athlete_id = fields.Int(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates("email")
    def validate_email(self, value):
        if "@" not in value:
            raise ValidationError("E-Mail muss ein '@' enthalten")

    @validates("trainer_id")
    def validate_trainer_id(self, value):
        pass
    
    @validates("athlete_id")
    def validate_athlete_id(self, value):
        pass
