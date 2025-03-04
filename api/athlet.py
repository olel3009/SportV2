class PerformanceData:
    def __init__(self, disciplin, date, result, points):
        self.disciplin = disciplin
        self.date = date
        self.result = result
        self.points = points

class SwimmingCertificate:
    def __init__(self, requirement, fulfilled: bool):
        self.requirement = requirement
        self.fulfilled = fulfilled

class Athlet:
    def __init__(self, first_name, last_name, gender, birthdate, swimming_proof: SwimmingCertificate, *performances: PerformanceData):
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.birthdate = birthdate        
        self.performances = list(performances)
        self.swimming_proof = swimming_proof
