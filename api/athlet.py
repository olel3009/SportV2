
class PerformanceData:
    def __init__(self, exersize, date, result, points):
        self.exersize = exersize
        self.date = date
        self.result = result
        self.points = points

class SwimmingCertificate:
    def __init__(self, requirement, fulfilled: bool):
        self.requirement = requirement
        self.fulfilled = fulfilled

class Athlet:
    def __init__(self, name, surname, sex, birthdate, swimming_proof: SwimmingCertificate, *performances: PerformanceData):
        self.name = name
        self.surname = surname
        self.sex = sex
        self.birthdate = birthdate        
        self.performances = performances
        self.swimming_proof = swimming_proof
