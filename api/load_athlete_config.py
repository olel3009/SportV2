from api.athlet import Athlet, PerformanceData, SwimmingCertificate
from database.models import Athlete as DBAthlete, Result

def load_athlete_for_export(athlete_id: int) -> Athlet:
    """
    Lädt einen Athleten anhand seiner ID aus der DB,
    erzeugt PerformanceData-Objekte aus dessen Results
    und gibt ein reines Python-Objekt Athlet zurück.
    """
    # 1) Aus DB holen
    db_ath = DBAthlete.query.get(athlete_id)
    if not db_ath:
        raise ValueError(f"Athlete mit ID {athlete_id} nicht gefunden.")

    # 2) Performance-Daten aus 'results' laden
    db_results = Result.query.filter_by(athlete_id=athlete_id).limit(4).all()

    # 3) Jede DB-Zeile in PerformanceData umwandeln
    performances = []
    for r in db_results:
        perf = PerformanceData(
            disciplin=r.disciplin,
            date=r.year,       # oder datetime, je nach DB-Spalte
            result=r.result,
            points=r.points
        )
        performances.append(perf)

    # 4) Schwimm-Nachweis anlegen (oder None, falls nicht nötig)
    swim_cert = SwimmingCertificate("Irgendein Schwimmabzeichen", True)

    # 5) Das reine Python-Objekt Athlet erstellen
    python_athlete = Athlet(
        first_name=db_ath.first_name,
        last_name=db_ath.last_name,
        gender=db_ath.gender,
        birthdate=db_ath.birth_date.strftime('%d-%m-%y'),
        swimming_proof=swim_cert,
        *performances
)

    return python_athlete
