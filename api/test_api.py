from flask import Flask, request, jsonify, make_response, render_template, session, flash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from athlet import Athlete, SwimmingCertificate, PerformanceData

app = Flask(__name__)
app.config['SECRET_KEY'] = 'fortnite'

swim = SwimmingCertificate("Lol", True)
perf = PerformanceData("Laufen Ausdauer", "2020", "7:30", 3)
ath = Athlete("Max", "Mustermann", "m", "11.09.2001", perf)


@app.route('/data', methods=['GET'])
def home():
    data = {
        "Name":ath.first_name,
        "Nachname":ath.last_name,
        "Geschlecht":ath.gender,
        "Geburtstag":ath.birth_date,
        "Übung":perf.disciplin,
        "Punkte":perf.points
    }
    return jsonify(data)

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Invalid token'}), 403

        return func(*args, **kwargs)

    return decorated

@app.route('/private')
@token_required
def auth():
    return "Private Page!"

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == "GET":
        return render_template("login.html")
    
    if request.form['username'] and request.form['password'] == '123456':
        session['logged_in'] = True
        token = jwt.encode({
            'user': request.form['username'],
            'expiration': str(datetime.utcnow() + timedelta(minutes=50))
        }, app.config['SECRET_KEY'])

        return jsonify({'token': token})
    else:
        return make_response('Unable to verify', 403, {'WWW-Authenticate': 'Basic realm: "Authentication Failed"'})


if __name__ == "__main__":
    app.run(debug=True)