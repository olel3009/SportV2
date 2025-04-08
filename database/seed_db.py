from datetime import date
from database import db
from database.models import Trainer, Athlete, Discipline, Rule, Result

def seed_test_data():
    # Erstelle mehrere Trainer
    trainers = [
        Trainer(first_name="Ole", last_name="Leister", email="ole.leister@trainer.de" , birth_date=date(2003,1,1), gender="m"),
        Trainer(first_name="Carlo", last_name="Bockermann", email="carlo.bockermann@trainer.de" , birth_date=date(2003,1,1), gender="m"),
    ]
    # Erstelle mehrere Athleten
    athletes = [
        Athlete(first_name="Lena", last_name="Müller", birth_date=date(2010,1,1), gender="f", swim_certificate=False),
        Athlete(first_name="Tom", last_name="Schmidt", birth_date=date(2009,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Alex", last_name="Klein", birth_date=date(2011,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Sophie", last_name="Bauer", birth_date=date(2008,1,1), gender="f", swim_certificate=True),
        Athlete(first_name="Jonas", last_name="Meier", birth_date=date(2010,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Marie", last_name="Schulz", birth_date=date(2012,1,1), gender="f", swim_certificate=False),
        Athlete(first_name="Lukas", last_name="Becker", birth_date=date(2011,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Emily", last_name="Fischer", birth_date=date(2010,1,1), gender="f", swim_certificate=True),
        Athlete(first_name="Paul", last_name="Hoffmann", birth_date=date(2008,1,1), gender="m", swim_certificate=True),
        Athlete(first_name="Lara", last_name="Wagner", birth_date=date(2011,1,1), gender="f", swim_certificate=True),
        Athlete(first_name="Tim", last_name="Neumann", birth_date=date(2008,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Anna", last_name="Hartmann", birth_date=date(2009,1,1), gender="f", swim_certificate=True),
        Athlete(first_name="Leon", last_name="Zimmermann", birth_date=date(2010,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Nina", last_name="Krüger", birth_date=date(2011,1,1), gender="f", swim_certificate=False),
        Athlete(first_name="Max", last_name="Wolf", birth_date=date(2009,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Lilly", last_name="Schneider", birth_date=date(2012,1,1), gender="f", swim_certificate=False),
        Athlete(first_name="Ben", last_name="Richter", birth_date=date(2008,1,1), gender="m", swim_certificate=False),
        Athlete(first_name="Emma", last_name="Koch", birth_date=date(2010,1,1), gender="f", swim_certificate=True),
        Athlete(first_name="Noah", last_name="Klein", birth_date=date(2008,1,1), gender="m", swim_certificate=True),
        Athlete(first_name="Clara", last_name="Werner", birth_date=date(2011,1,1), gender="f", swim_certificate=True),
        Athlete(first_name="Luis", last_name="Schäfer", birth_date=date(2009,1,1), gender="m", swim_certificate=False),
    ]
    # Erstelle mehrere Disziplinen
    disciplines = [
        Discipline(group_name="Ausdauer"),
        Discipline(group_name="Kraft"),
        Discipline(group_name="Schnelligkeit"),
        Discipline(group_name="Koordination")
    ]
    # Füge alle Athleten und Disziplinen zur Session hinzu
    db.session.add_all(trainers)
    db.session.add_all(athletes)
    db.session.add_all(disciplines)
    db.session.commit()

    # Erstelle Rules für die Disziplinen
    rules = [
        Rule(discipline_id=disciplines[0].id, rule_name="800m Lauf, 6-7", unit="time",
        description_m="800m Lauf", description_f="800m Lauf",
        min_age=6, max_age=7,
        threshold_bronze_m=5.40, threshold_silver_m=5.00, threshold_gold_m=4.15,
        threshold_bronze_f=5.40, threshold_silver_f=5.00, threshold_gold_f=4.15,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[0].id, rule_name="800m Lauf, 8-9", unit="time",
        description_m="800m Lauf", description_f="800m Lauf",
        min_age=8, max_age=9,
        threshold_bronze_m=5.25, threshold_silver_m=4.40, threshold_gold_m=4.10,
        threshold_bronze_f=5.20, threshold_silver_f=5.10, threshold_gold_f=3.55,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[0].id, rule_name="800m Lauf, 10-11", unit="time",
        description_m="800m Lauf", description_f="800m Lauf",
        min_age=10, max_age=11,
        threshold_bronze_m=5.05, threshold_silver_m=4.20, threshold_gold_m=4.00,
        threshold_bronze_f=5.05, threshold_silver_f=4.20, threshold_gold_f=3.35,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[0].id, rule_name="800m Lauf, 12-13", unit="time",
        description_m="800m Lauf", description_f="800m Lauf",
        min_age=12, max_age=13,
        threshold_bronze_m=4.45, threshold_silver_m=4.00, threshold_gold_m=3.35,
        threshold_bronze_f=4.45, threshold_silver_f=4.00, threshold_gold_f=3.15,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[0].id, rule_name="800m Lauf, 14-15", unit="time",
        description_m="800m Lauf", description_f="800m Lauf",
        min_age=14, max_age=15,
        threshold_bronze_m=4.20, threshold_silver_m=3.40, threshold_gold_m=3.00,
        threshold_bronze_f=4.20, threshold_silver_f=3.40, threshold_gold_f=3.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[0].id, rule_name="800m Lauf, 16-17", unit="time",
        description_m="800m Lauf", description_f="800m Lauf",
        min_age=16, max_age=17,
        threshold_bronze_m=4.20, threshold_silver_m=3.25, threshold_gold_m=3.00,
        threshold_bronze_f=4.20, threshold_silver_f=3.25, threshold_gold_f=3.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[1].id, rule_name="Schlagballwurf, 6-7", unit="distance",
        description_m="Schlagballwurf (80 g)", description_f="Schlagballwurf (80 g)",
        min_age=6, max_age=7,
        threshold_bronze_m=12.00, threshold_silver_m=15.00, threshold_gold_m=17.00,
        threshold_bronze_f=6.00, threshold_silver_f=9.00, threshold_gold_f=12.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[1].id, rule_name="Schlagballwurf, 8-9", unit="distance",
        description_m="Schlagballwurf (80 g)", description_f="Schlagballwurf (80 g)",
        min_age=8, max_age=9,
        threshold_bronze_m=17.00, threshold_silver_m=20.00, threshold_gold_m=23.00,
        threshold_bronze_f=9.00, threshold_silver_f=12.00, threshold_gold_f=15.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[1].id, rule_name="Schlagballwurf, 10-11", unit="distance",
        description_m="Schlagballwurf (80 g)", description_f="Schlagballwurf (80 g)",
        min_age=10, max_age=11,
        threshold_bronze_m=21.00, threshold_silver_m=25.00, threshold_gold_m=28.00,
        threshold_bronze_f=11.00, threshold_silver_f=15.00, threshold_gold_f=18.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[1].id, rule_name="Schlagballwurf, 12-13", unit="distance",
        description_m="Schlagballwurf (80 g)", description_f="Schlagballwurf (80 g)",
        min_age=12, max_age=13,
        threshold_bronze_m=26.00, threshold_silver_m=30.00, threshold_gold_m=33.00,
        threshold_bronze_f=15.00, threshold_silver_f=18.00, threshold_gold_f=22.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[1].id, rule_name="Schlagballwurf, 14-15", unit="distance",
        description_m="Schlagballwurf (80 g)", description_f="Schlagballwurf (80 g)",
        min_age=14, max_age=15,
        threshold_bronze_m=30.00, threshold_silver_m=34.00, threshold_gold_m=37.00,
        threshold_bronze_f=20.00, threshold_silver_f=24.00, threshold_gold_f=27.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[1].id, rule_name="Schlagballwurf, 16-17", unit="distance",
        description_m="Schlagballwurf (80 g)", description_f="Schlagballwurf (80 g)",
        min_age=16, max_age=17,
        threshold_bronze_m=34.00, threshold_silver_m=38.00, threshold_gold_m=42.00,
        threshold_bronze_f=24.00, threshold_silver_f=27.00, threshold_gold_f=31.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[2].id, rule_name="25 m Schwimmen, 6-7", unit="time",
        description_m="25 m Schwimmen", description_f="25 m Schwimmen",
        min_age=6, max_age=7,
        threshold_bronze_m=46.00, threshold_silver_m=38.00, threshold_gold_m=30.00,
        threshold_bronze_f=46.50, threshold_silver_f=38.50, threshold_gold_f=30.50,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[2].id, rule_name="25 m Schwimmen, 8-9", unit="time",
        description_m="25 m Schwimmen", description_f="25 m Schwimmen",
        min_age=8, max_age=9,
        threshold_bronze_m=41.00, threshold_silver_m=33.00, threshold_gold_m=26.00,
        threshold_bronze_f=42.00, threshold_silver_f=34.00, threshold_gold_f=28.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[2].id, rule_name="25 m Schwimmen, 10-11", unit="time",
        description_m="25 m Schwimmen", description_f="25 m Schwimmen",
        min_age=10, max_age=11,
        threshold_bronze_m=36.00, threshold_silver_m=29.00, threshold_gold_m=22.50,
        threshold_bronze_f=39.00, threshold_silver_f=31.50, threshold_gold_f=25.50,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[2].id, rule_name="25 m Schwimmen, 12-13", unit="time",
        description_m="25 m Schwimmen", description_f="25 m Schwimmen",
        min_age=12, max_age=13,
        threshold_bronze_m=33.00, threshold_silver_m=27.00, threshold_gold_m=21.00,
        threshold_bronze_f=35.00, threshold_silver_f=29.00, threshold_gold_f=23.50,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[2].id, rule_name="25 m Schwimmen, 14-15", unit="time",
        description_m="25 m Schwimmen", description_f="25 m Schwimmen",
        min_age=14, max_age=15,
        threshold_bronze_m=31.00, threshold_silver_m=25.50, threshold_gold_m=20.00,
        threshold_bronze_f=33.00, threshold_silver_f=27.50, threshold_gold_f=21.50,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[2].id, rule_name="25 m Schwimmen, 16-17", unit="time",
        description_m="25 m Schwimmen", description_f="25 m Schwimmen",
        min_age=16, max_age=17,
        threshold_bronze_m=29.50, threshold_silver_m=24.50, threshold_gold_m=19.00,
        threshold_bronze_f=30.50, threshold_silver_f=25.50, threshold_gold_f=20.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[3].id, rule_name="Hochsprung, 6-7", unit="distance",
        description_m="Hochsprung", description_f="Hochsprung",
        min_age=6, max_age=7,
        threshold_bronze_m=0.85, threshold_silver_m=0.95, threshold_gold_m=1.05,
        threshold_bronze_f=0.80, threshold_silver_f=0.90, threshold_gold_f=1.00,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[3].id, rule_name="Hochsprung, 8-9", unit="distance",
        description_m="Hochsprung", description_f="Hochsprung",
        min_age=8, max_age=9,
        threshold_bronze_m=0.95, threshold_silver_m=1.05, threshold_gold_m=1.15,
        threshold_bronze_f=0.90, threshold_silver_f=1.00, threshold_gold_f=1.10,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[3].id, rule_name="Hochsprung, 10-11", unit="distance",
        description_m="Hochsprung", description_f="Hochsprung",
        min_age=10, max_age=11,
        threshold_bronze_m=1.05, threshold_silver_m=1.15, threshold_gold_m=1.25,
        threshold_bronze_f=1.00, threshold_silver_f=1.10, threshold_gold_f=1.20,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[3].id, rule_name="Hochsprung, 12-13", unit="distance",
        description_m="Hochsprung", description_f="Hochsprung",
        min_age=12, max_age=13,
        threshold_bronze_m=1.10, threshold_silver_m=1.20, threshold_gold_m=1.30,
        threshold_bronze_f=1.10, threshold_silver_f=1.20, threshold_gold_f=1.30,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[3].id, rule_name="Hochsprung, 14-15", unit="distance",
        description_m="Hochsprung", description_f="Hochsprung",
        min_age=14, max_age=15,
        threshold_bronze_m=1.20, threshold_silver_m=1.30, threshold_gold_m=1.40,
        threshold_bronze_f=1.10, threshold_silver_f=1.25, threshold_gold_f=1.35,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    ),
        Rule(discipline_id=disciplines[3].id, rule_name="Hochsprung, 16-17", unit="distance",
        description_m="Hochsprung", description_f="Hochsprung",
        min_age=16, max_age=17,
        threshold_bronze_m=1.30, threshold_silver_m=1.40, threshold_gold_m=1.50,
        threshold_bronze_f=1.15, threshold_silver_f=1.25, threshold_gold_f=1.255,
        valid_start=date(2025,1,1), valid_end=date(2025,12,31), version = 1
    )
    ]
    db.session.add_all(rules)
    db.session.commit()
    
    # Optional: Mehrere Result-Datensätze anlegen
    results = [ 
        Result(athlete_id=athletes[0].id, rule_id=rules[4].id,
        year=2025, age=2025 - athletes[0].birth_date.year,
        result=2.45, medal="Gold"
    ),
        Result(athlete_id=athletes[1].id, rule_id=rules[23].id,
        year=2025, age=2025 - athletes[1].birth_date.year,
        result=1.45, medal="Silber"
    ),
        Result(athlete_id=athletes[2].id, rule_id=rules[16].id,
        year=2025, age=2025 - athletes[2].birth_date.year,
        result=38.00
    ),
        Result(athlete_id=athletes[3].id, rule_id=rules[17].id,
        year=2025, age=2025 - athletes[3].birth_date.year,
        result=30.00, medal="Bronze"
    ),
        Result(athlete_id=athletes[4].id, rule_id=rules[10].id,
        year=2025, age=2025 - athletes[4].birth_date.year,
        result=38.00, medal="Gold"
    ),
        Result(athlete_id=athletes[5].id, rule_id=rules[3].id,
        year=2025, age=2025 - athletes[5].birth_date.year,
        result=3.05, medal="Gold"
    ),
        Result(athlete_id=athletes[6].id, rule_id=rules[23].id,
        year=2025, age=2025 - athletes[6].birth_date.year,
        result=1.00
    ),
        Result(athlete_id=athletes[7].id, rule_id=rules[10].id,
        year=2025, age=2025 - athletes[7].birth_date.year,
        result=22.00, medal="Bronze"
    ),
        Result(athlete_id=athletes[8].id, rule_id=rules[17].id,
        year=2025, age=2025 - athletes[8].birth_date.year,
        result=19.00, medal="Gold"
    ),
        Result(athlete_id=athletes[9].id, rule_id=rules[4].id,
        year=2025, age=2025 - athletes[9].birth_date.year,
        result=3.30, medal="Silber"
    ),
        Result(athlete_id=athletes[10].id, rule_id=rules[23].id,
        year=2025, age=2025 - athletes[10].birth_date.year,
        result=1.20, medal="Bronze"
    ),
        Result(athlete_id=athletes[11].id, rule_id=rules[4].id,
        year=2025, age=2025 - athletes[11].birth_date.year,
        result=2.45, medal="Gold"
    ),
        Result(athlete_id=athletes[12].id, rule_id=rules[11].id,
        year=2025, age=2025 - athletes[12].birth_date.year,
        result=29.00, medal="Silber"
    ),
        Result(athlete_id=athletes[13].id, rule_id=rules[16].id,
        year=2025, age=2025 - athletes[13].birth_date.year,
        result=2.55, medal="Gold"
    ),
        Result(athlete_id=athletes[14].id, rule_id=rules[16].id,
        year=2025, age=2025 - athletes[14].birth_date.year,
        result=32.00, medal="Bronze"
    ),
        Result(athlete_id=athletes[15].id, rule_id=rules[11].id,
        year=2025, age=2025 - athletes[15].birth_date.year,
        result=42, medal="Gold"
    ),
        Result(athlete_id=athletes[16].id, rule_id=rules[19].id,
        year=2025, age=2025 - athletes[16].birth_date.year,
        result=1.40, medal="Gold"
    ),
        Result(athlete_id=athletes[17].id, rule_id=rules[23].id,
        year=2025, age=2025 - athletes[17].birth_date.year,
        result=2.50, medal="Gold"
    ),
        Result(athlete_id=athletes[18].id, rule_id=rules[10].id,
        year=2025, age=2025 - athletes[18].birth_date.year,
        result=21.00, medal="Bronze"
    ),
        Result(athlete_id=athletes[19].id, rule_id=rules[17].id,
        year=2025, age=2025 - athletes[19].birth_date.year,
        result=16.00, medal="Gold"
    ),
        Result(athlete_id=athletes[20].id, rule_id=rules[10].id,
        year=2025, age=2025 - athletes[20].birth_date.year,
        result=25.00, medal="Silber"
    ),
        Result(athlete_id=athletes[21].id, rule_id=rules[17].id,
        year=2025, age=2025 - athletes[21].birth_date.year,
        result=29.00, medal="Bronze"
    ),
    ]
    db.session.add_all(results)
    db.session.commit()
    print("Testdaten eingefügt.")
