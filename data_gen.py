import random
import csv
from database.models import Athlete
from datetime import datetime, date

def parse_date(d: str):
    print(d)
    new_date = d.split("-")
    print(new_date)
    new_date = date(int(new_date[1]), int(new_date[1]), int(new_date[2]))
    print(type(new_date))
    return datetime.strftime(new_date, "%d.%m.%Y")

print(parse_date("01-01-2000"))

athletes = [
        Athlete(first_name="Lena", last_name="Müller", email = "lena.mueller@test.de", birth_date=parse_date("1.1.2010"), gender="f", swim_certificate=False),
        Athlete(first_name="Tom", last_name="Schmidt", email = "tom.schmidt@test.de", birth_date=parse_date("1.1.2009"), gender="m", swim_certificate=False),
        Athlete(first_name="Alex", last_name="Klein", email = "alex.klein@test.de", birth_date=parse_date("1.1.2011"), gender="m", swim_certificate=False),
        Athlete(first_name="Sophie", last_name="Bauer", email = "sophie.bauer@test.de", birth_date=parse_date("1.1.2008"), gender="f", swim_certificate=True),
        Athlete(first_name="Jonas", last_name="Meier", email = "jonas.meier@test.de", birth_date=parse_date("1.1.2010"), gender="m", swim_certificate=False),
        Athlete(first_name="Marie", last_name="Schulz", email = "marie.schulz@test.de", birth_date=parse_date("1.1.2012"), gender="f", swim_certificate=False),
        Athlete(first_name="Lukas", last_name="Becker", email = "lukas.becker@test.de", birth_date=parse_date("1.1.2011"), gender="m", swim_certificate=False),
        Athlete(first_name="Emily", last_name="Fischer", email = "emily.fischer@test.de", birth_date=parse_date("1.1.2010"), gender="f", swim_certificate=True),
        Athlete(first_name="Paul", last_name="Hoffmann", email = "paul.hoffmann@test.de", birth_date=parse_date("1.1.2008"), gender="m", swim_certificate=True),
        Athlete(first_name="Lara", last_name="Wagner", email = "lara.wagner@test.de", birth_date=parse_date("1.1.2011"), gender="f", swim_certificate=True),
        Athlete(first_name="Tim", last_name="Neumann", email = "tim.neumann@test.de", birth_date=parse_date("1.1.2008"), gender="m", swim_certificate=False),
        Athlete(first_name="Anna", last_name="Hartmann", email = "anna.hartmann@test.de", birth_date=parse_date("1.1.2009"), gender="f", swim_certificate=True),
        Athlete(first_name="Leon", last_name="Zimmermann", email = "leon.zimmermann@test.de", birth_date=parse_date("1.1.2010"), gender="m", swim_certificate=False),
        Athlete(first_name="Nina", last_name="Krüger", email = "nina.krueger@test.de", birth_date=parse_date("1.1.2011"), gender="f", swim_certificate=False),
        Athlete(first_name="Max", last_name="Wolf", email = "max.wolf@test.de", birth_date=parse_date("1.1.2009"), gender="m", swim_certificate=False),
        Athlete(first_name="Lilly", last_name="Schneider", email = "lilly.schneider@test.de", birth_date=parse_date("1.1.2012"), gender="f", swim_certificate=False),
        Athlete(first_name="Ben", last_name="Richter", email = "ben.richter@test.de", birth_date=parse_date("1.1.2008"), gender="m", swim_certificate=False),
        Athlete(first_name="Emma", last_name="Koch", email = "emma.koch@test.de", birth_date=parse_date("1.1.2010"), gender="f", swim_certificate=True),
        Athlete(first_name="Noah", last_name="Klein", email = "noah.klein@test.de", birth_date=parse_date("1.1.2008"), gender="m", swim_certificate=True),
        Athlete(first_name="Clara", last_name="Werner", email = "clara.werner@test.de", birth_date=parse_date("1.1.2011"), gender="f", swim_certificate=True),
        Athlete(first_name="Luis", last_name="Schäfer", email = "luis.schaefer@test.de", birth_date=parse_date("1.1.2009"), gender="m", swim_certificate=False),
    ]

#Regeln ziehen und in Liste speichern
csv_rules = r"api\data\regelung-beispiel.csv"
with open(csv_rules, newline="") as csv_data:
    rules=[]
    drules={
        "Ausdauer":[],
        "Kraft":[],
        "Schnelligkeit":[],
        "Koordination":[]
    }
    reader = csv.DictReader(csv_data, delimiter=";")
    for line in reader:
        rules.append(line)
        
#for line in rules:
#    print(line)

def random_date(start, end):
    return start + (end - start) * random.random()

#print(random_bday())

def random_athlete():
    rand_ath = random.choice(athletes)        
    return f"{rand_ath.last_name};{rand_ath.first_name};{rand_ath.gender};{rand_ath.birth_date}", rand_ath.gender

#print(random_athlete())

perfs = {
    "Ausdauer": [
        "800m Lauf",
        "Dauer-/Geländelauf",
        "Schwimmen",
        "Radfahren"
    ],
    "Kraft": [
        "Werfen",
        "Schlagball",
        "Medizinball/Kugelstoßen",
        "Geräteturnen",
        "Standweitsprung"
    ],
    "Schnelligkeit": [
        "Geräteturnen",
        "Laufen",
        "25 m Schwimmen",
        "200 m Radfahren"
    ],
    "Koordination": [
        "Zonenweitsprung",
        "Hochsprung",
        "Weitsprung",
        "Drehwurf",
        "Schleuderball",
        "Geräteturnen"
    ]
}

def random_exer():
    rand_kategorie = random.choice(["Ausdauer","Kraft","Schnelligkeit","Koordination"])
    rand_ue = random.choice(perfs[rand_kategorie])
    return rand_ue, rand_kategorie  

def deviation(bronze_value, gold_value):
    value = bronze_value + abs(gold_value - bronze_value) * random.random()
    positiv = value * 1.15
    negativ = value * 0.85
    return round(random.choice([positiv, negativ]), 2)

def random_perf(r_ath, bday, r_exer):
    for line in rules:
        if str(bday[1]) in line["Regelungsname"] and r_exer[1] in line["Disziplin"] and r_exer[0] in line["Regelungsname"]:
            if r_ath[1] == "f":
                perf = deviation(float(line["Bronze-Weiblich"]), float(line["Gold-Weiblich"]))
                return perf
            else:
                perf = deviation(float(line["Bronze-Maennlich"]), float(line["Gold-Maennlich"]))
                return perf

def generate_csv_data(n: int)->list:
    data=[]
    for i in range(1, n):
        r_ath = random_athlete()
        bday = random_athlete()[0].split(";")[3]
        r_exer = random_exer()
        r_perf = random_perf(r_ath, bday, r_exer)
        if r_perf == None:
            pass
        else:
            data.append(f"{r_ath[0]};{r_exer[0]};{r_exer[1]};{int(random_date(2020, 2025))};Bronze;{random_perf(r_ath, bday, r_exer)}")
    return data

csv_athletes = r"api\data\athleten.csv"

with open(csv_athletes, "w", newline="", encoding="utf-8-sig") as destination:
    writer = csv.writer(destination, delimiter='"', quotechar="'")
    writer.writerow(["Name;Vorname;Geschlecht;Geburtsdatum;Übung;Kategorie;Datum;Ergebnis;Punkte"])
    data = generate_csv_data(1000)
    for line in data:
        writer.writerow([line])
        