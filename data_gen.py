from datetime import date
from datetime import datetime
import random
import csv
from collections import defaultdict

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

start_date = date(2008, 1, 1)
end_date = date(2019, 12, 31)
def random_bday():
    random_birthday = random_date(start_date, end_date)
    age = datetime.today().year - random_birthday.year
    random_birthday = str(random_birthday).split("-")
    return f"{str(random_birthday[2])}.{str(random_birthday[1])}.{str(random_birthday[0])}", age

#print(random_bday())

surname_m = [
    "Ben", "Paul", "Leon", "Elias", "Noah",
    "Finn", "Emil", "Felix", "Luis", "Jonas",
    "Theo", "Max", "Moritz", "Henry", "Lukas",
    "Oskar", "Mats", "Anton", "Jakob", "Tom",
    "David", "Nico", "Tim", "Jannik", "Simon",
    "Liam", "Philipp", "Lenny", "Samuel", "Jonathan"
]

surname_f = [
    "Emilia", "Emma", "Mia", "Lina", "Hannah", 
    "Marie", "Ella", "Lea", "Sophia", "Anna",
    "Mila", "Leni", "Luisa", "Clara", "Frieda",
    "Lotta", "Amelie", "Nora", "Paula", "Lia",
    "Ida", "Lara", "Charlotte", "Mathilda", "Greta",
    "Alina", "Maja", "Juna", "Elena", "Isabella"
]

name = [
    "Müller", "Schmidt", "Schneider", "Fischer", "Weber", 
    "Meyer", "Wagner",  "Becker",  "Schulz",  "Hoffmann",
    "Schäfer", "Koch", "Bauer", "Richter", "Klein",
    "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann",
    "Braun", "Krüger", "Hofmann", "Hartmann", "Lange",
    "Schmitt", "Werner", "Schmitz", "Krause", "Meier"
]

def random_name():
    rand_sex = random.choice([surname_f, surname_m])
    if rand_sex == surname_f:
        sex = "f"
    else: 
        sex = "m"
    rand_surn = random.choice(rand_sex)
    rand_name= random.choice(name)
    return f"{rand_name};{rand_surn}", sex

#print(random_name())

perfs = {
    "Ausdauer": [
        "Laufen",
        "10km Lauf",
        "Dauer-/Geländelauf",
        "7,5km Walking/Nordic Walking",
        "Schwimmen",
        "Radfahren"
    ],
    "Kraft": [
        "Schlagball",
        "Medizinball",
        "Kugelstoßen",
        "Steinstoßen",
        "Standweitsprung",
    ],
    "Schnelligkeit": [
        "Laufen",
        "Schwimmen",
        "Radfahren",
    ],
    "Koordination": [
        "Hochsprung",
        "Weitsprung",
        "Drehwurf",
        "Schleuderball"
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

def random_perf(r_name, r_bday, r_exer):
    for line in rules:
        if str(r_bday[1]) in line["Regelungsname"] and r_exer[1] in line["Disziplin"] and r_exer[0] in line["Regelungsname"]:
            if r_name[1] == "f":
                perf = deviation(float(line["Bronze-Weiblich"]), float(line["Gold-Weiblich"]))
                return perf
            else:
                perf = deviation(float(line["Bronze-Maennlich"]), float(line["Gold-Maennlich"]))
                return perf

def generate_csv_data(n: int)->list:
    data=[]
    for i in range(1, n):
        r_name = random_name()
        r_bday = random_bday()
        r_exer = random_exer()
        data.append(f"{r_name[0]};{r_bday[0]};{r_exer[0]};{r_exer[1]};{random_perf(r_name, r_bday, r_exer)};{int(random_date(2020, 2025))}")
    return data

csv_athletes = r"api\data\athleten.csv"

with open(csv_athletes, "w", newline="") as destination:
    writer = csv.writer(destination, delimiter='"')
    writer.writerow(["Nachname;Vorname;Geburtstag;Uebung;Kategorie;Leistung;Datum"])
    data = generate_csv_data(1000)
    for line in data:
        writer.writerow([line])
        