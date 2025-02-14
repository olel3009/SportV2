flask db init
flask db migrate -m "Add tables for athletes, trainers, results, user and regeln"
flask db upgrade