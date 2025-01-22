
class PerformanceData:
    def __init__(self, exersize, date, result, points):
        self.exersize = exersize
        self.date = date
        self.result = result
        self.points = points

class SwimmingCertificate:
    def __init__(self, requirement, fullfilled: bool):
        self.requirement = requirement
        self.fullfilled = fullfilled

class Athlet:
    def __init__(self, name, surname, sex, birthdate, performances: PerformanceData, swimming_proof: SwimmingCertificate):
        self.name = name
        self.surname = surname
        self.sex = sex
        self.birthdate = birthdate        
        self.performances = performances
        self.swimming_proof = swimming_proof
