class PerformanceData:
    def __init__(self, disciplin, year, result, points):
        self.disciplin = disciplin
        self.year = year
        self.result = result
        self.points = points

class SwimmingCertificate:
    def __init__(self, requirement, fulfilled: bool):
        self.requirement = requirement
        self.fulfilled = fulfilled

class Athlete:
    def __init__(self, first_name, last_name, gender, birth_date, performances=None):
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.birth_date = birth_date      # datetime.date oder String
        self.performances = performances if performances else []
