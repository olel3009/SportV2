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


# Rule-Schema
class RuleSchema(Schema):
    rulename = fields.Str(required=True, validate=Length(min=1, max=255))
    description = fields.Str(required=False, allow_none=True)
    disciplin = fields.Str(required=True, validate=Length(min=1, max=255))
    distance = fields.Int(required=True, validate=Range(min=0))
    time_in_seconds = fields.Int(required=True, validate=Range(min=0))
    points = fields.Int(required=True, validate=Range(min=1, max=3))
    valid_start = fields.Date(required=True, format="%d-%m-%Y")
    valid_end = fields.Date(required=False, allow_none=True, format="%d-%m-%Y")
    version = fields.Int(missing=1)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    # Beispiel: valid_end >= valid_start
    @validates("valid_end")
    def validate_dates(self, value):
        if value is None:
            return
        if "valid_start" in self.context:
            start = self.context["valid_start"]
            if value < start:
                raise ValidationError("valid_end darf nicht vor valid_start liegen.")


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
