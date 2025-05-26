class PerformanceData:
    def __init__(self, disciplin, year, result, points):
        self.disciplin = disciplin
        self.year = year
        self.result = result
        self.points = points
class   Athlete:
    def __init__(self, first_name, last_name, gender, birth_date, swim_certificate, performances=None):
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.birth_date = birth_date
        self.swim_certificate = swim_certificate
        self.performances = performances if performances else []
