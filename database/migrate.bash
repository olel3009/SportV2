flask db init
flask db migrate -m "Add tables for athletes, trainers, results, and regeln"
flask db upgrade