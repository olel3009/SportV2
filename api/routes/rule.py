from flask import Blueprint, request, jsonify
from database.models import Rule
from database.schemas import RuleSchema
from database import db

bp_rule = Blueprint('rule', __name__)

# CREATE Rule
@bp_rule.route('/rules', methods=['POST'])
def create_rule():
    data = request.json
    schema = RuleSchema()
    valid_data = schema.load(data)  # ValidationError -> 400

    # Versionserhöhung, wenn bereits Einträge mit demselben rule_name existieren
    existing_rules = Rule.query.filter_by(rule_name=valid_data['rule_name']).all()
    if existing_rules:
        max_version = max(r.version for r in existing_rules)
        new_version = max_version + 1
    else:
        new_version = 1

    new_rule = Rule(
        discipline_id=valid_data['discipline_id'],
        rule_name=valid_data['rule_name'],
        unit=valid_data['unit'],
        description_m=valid_data['description_m'],
        description_f=valid_data['description_f'],
        min_age=valid_data['min_age'],
        max_age=valid_data['max_age'],

        threshold_bronze_m=valid_data['threshold_bronze_m'],
        threshold_silver_m=valid_data['threshold_silver_m'],
        threshold_gold_m=valid_data['threshold_gold_m'],

        threshold_bronze_f=valid_data['threshold_bronze_f'],
        threshold_silver_f=valid_data['threshold_silver_f'],
        threshold_gold_f=valid_data['threshold_gold_f'],

        action=valid_data['action'],
        valid_start=valid_data['valid_start'],
        valid_end=valid_data.get('valid_end'),
        version=new_version
    )
    db.session.add(new_rule)
    db.session.commit()
    return jsonify({"message": "Rule created", "id": new_rule.id, "version": new_rule.version}), 201

# READ Rules
@bp_rule.route('/rules', methods=['GET'])
def get_rules():
    all_rules = Rule.query.all()
    schema = RuleSchema(many=True)
    result = schema.dump(all_rules)
    return jsonify(result)

# UPDATE Rule
@bp_rule.route('/rules/<int:id>', methods=['PUT'])
def update_rule(id):
    rule = Rule.query.get_or_404(id)
    data = request.json

    # Partial Updates
    schema = RuleSchema(partial=True)
    valid_data = schema.load(data)

    if 'discipline_id' in valid_data:
        rule.discipline_id = valid_data['discipline_id']
    if 'rule_name' in valid_data:
        rule.rule_name = valid_data['rule_name']
    if 'unit' in valid_data:
        rule.unit = valid_data['unit']
    if 'description_m' in valid_data:
        rule.description_m = valid_data['description_m']
    if 'description_f' in valid_data:
        rule.description_f = valid_data['description_f']
    if 'min_age' in valid_data:
        rule.min_age = valid_data['min_age']
    if 'max_age' in valid_data:
        rule.max_age = valid_data['max_age']

    if 'threshold_bronze_m' in valid_data:
        rule.threshold_bronze_m = valid_data['threshold_bronze_m']
    if 'threshold_silver_m' in valid_data:
        rule.threshold_silver_m = valid_data['threshold_silver_m']
    if 'threshold_gold_m' in valid_data:
        rule.threshold_gold_m = valid_data['threshold_gold_m']

    if 'threshold_bronze_f' in valid_data:
        rule.threshold_bronze_f = valid_data['threshold_bronze_f']
    if 'threshold_silver_f' in valid_data:
        rule.threshold_silver_f = valid_data['threshold_silver_f']
    if 'threshold_gold_f' in valid_data:
        rule.threshold_gold_f = valid_data['threshold_gold_f']

    if 'action' in valid_data:
        rule.action = valid_data['action']
    if 'valid_start' in valid_data:
        rule.valid_start = valid_data['valid_start']
    if 'valid_end' in valid_data:
        rule.valid_end = valid_data['valid_end']

    db.session.commit()
    return jsonify({"message": "Rule updated"})

# DELETE Rule
@bp_rule.route('/rules/<int:id>', methods=['DELETE'])
def delete_rule(id):
    rule = Rule.query.get_or_404(id)
    db.session.delete(rule)
    db.session.commit()
    return jsonify({"message": "Rule deleted"})
