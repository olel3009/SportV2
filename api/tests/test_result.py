import pytest
from datetime import datetime

# Hilfsfunktionen, um in jedem Test einen Athlete und einen Rule anzulegen.
def create_test_athlete(client, first_name="Test", last_name="Athlete", birth_date="1.1.2003", gender="m"):
    pass

def create_test_rule(client, 
                     rule_name="Test Rule",
                     discipline_id =1, 
                     min_age=18, 
                     max_age=40, 
                     valid_start="01.01.2025", 
                     valid_end="31.12.2025",
                     unit="Min.,Sek.",
                     description_m="Kraftübung 80g",
                     description_f="Kraftübung 80g",
                     threshold_bronze_m=30.0,
                     threshold_silver_m=25.0,
                     threshold_gold_m=20.0,
                     threshold_bronze_f=30.0,  
                     threshold_silver_f=25.0,
                     threshold_gold_f=20.0):
    pass

# Test für unit "time" (niedriger Wert ist besser)
@pytest.mark.skip(reason="Deaktiviert")
def test_create_result_time(client):
    pass

# Test für unit "distance" (höherer Wert ist besser)
@pytest.mark.skip(reason="Deaktiviert")
def test_create_result_distance(client):
    pass

@pytest.mark.skip(reason="Deaktiviert")
def test_update_result(client):
    pass

@pytest.mark.skip(reason="Deaktiviert")
def test_delete_result(client):
    pass
