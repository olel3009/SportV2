import { Exercise, Expectation } from "../src/models/athlete"
//note: in the following data 2:40 minutes is written as 2.4 
let basedata = `[
    {
        "name": "800 m Lauf",
        "discipline": "Ausdauer",
        "unit": "min", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [5.4, 5, 4.15],
                "medalThresholdsW": [5.4, 5, 4.15],
                "action": "800 m Lauf"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [5.25, 4.4, 3.55],
                "medalThresholdsW": [5.35, 4.5, 4.10],
                "action": "800 m Lauf"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [5.05, 4.2, 3.35],
                "medalThresholdsW": [5.2, 4.4, 4],
                "action": "800 m Lauf"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [4.45, 4, 3.15],
                "medalThresholdsW": [5.1, 4.25, 3.45],
                "action": "800 m Lauf"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [4.20, 3.4, 3],
                "medalThresholdsW": [5, 4.2, 3.35],
                "action": "800 m Lauf"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [4.05, 3.25, 2.45],
                "medalThresholdsW": [4.5, 4.05, 3.25],
                "action": "800 m Lauf"
            }
        ]
    },
    {
        "name": "Dauer-/Geländelauf",
        "discipline": "Ausdauer",
        "unit": "min", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [10, 15, 20],
                "medalThresholdsW": [8,12,17],
                "action": "Möglichst lange laufen"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [12, 17, 23],
                "medalThresholdsW": [10, 15, 20],
                "action": "Möglichst lange laufen"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [17, 25, 35],
                "medalThresholdsW": [15, 20, 30],
                "action": "Möglichst lange laufen"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [25, 35, 45],
                "medalThresholdsW": [20, 30, 40],
                "action": "Möglichst lange laufen"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [35, 45, 60],
                "medalThresholdsW": [30, 40, 50],
                "action": "Möglichst lange laufen"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [55, 70, 90],
                "medalThresholdsW": [45, 60, 75],
                "action": "Möglichst lange laufen"
            }
        ]
    },
    {
        "name": "Schwimmen",
        "discipline": "Ausdauer",
        "unit": "min", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [9, 7.2, 6.1],
                "medalThresholdsW": [9, 7.4, 6.2],
                "action": "200 m"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [8, 6.45, 5.4],
                "medalThresholdsW": [8, 7, 5.55],
                "action": "200 m"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [7, 6.2, 5.1],
                "medalThresholdsW": [7.2, 6.25, 5.3],
                "action": "200 m"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [13.3, 11.3, 9.45],
                "medalThresholdsW": [14.5, 12.55, 11],
                "action": "400 m"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [12, 10.15, 8.5],
                "medalThresholdsW": [13.05, 11.4, 10],
                "action": "400 m"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [11, 9.4, 8.2],
                "medalThresholdsW": [11.5, 10.3, 9.05],
                "action": "400 m"
            }
        ]
    },
    {
        "name": "Radfahren",
        "discipline": "Ausdauer",
        "unit": "min", 
        "expectations": [
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [26.3, 23.3, 20.3],
                "medalThresholdsW": [27, 24, 21],
                "action": "5 km"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [48.3, 41, 33.3],
                "medalThresholdsW": [50.3, 43, 35.3],
                "action": "10 km"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [43, 37, 31.3],
                "medalThresholdsW": [45, 39.3, 33.3],
                "action": "10 km"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [32, 28, 24],
                "medalThresholdsW": [38, 32.3, 28.3],
                "action": "10 km"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [27, 23.3, 20.3],
                "medalThresholdsW": [32.3, 28.3, 25],
                "action": "10 km"
            }
        ]
    },
    {
        "name": "Werfen",
        "discipline": "Kraft",
        "unit": "m", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [12, 15, 17],
                "medalThresholdsW": [6, 9, 12],
                "action": "Schlagball 80 g"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [17, 20, 23],
                "medalThresholdsW": [9, 12, 15],
                "action": "Schlagball 80 g"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [21, 25, 28],
                "medalThresholdsW": [11, 15, 18],
                "action": "Schlagball 80 g"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [26, 30, 33],
                "medalThresholdsW": [15, 18, 22],
                "action": ["Wurfball 200 g", "Schlagball 80 g"]
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [30, 34, 37],
                "medalThresholdsW": [20, 24, 27],
                "action": "Wurfball 200 g"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [34, 38, 42],
                "medalThresholdsW": [24, 27, 31],
                "action": "Wurfball 200 g"
            }
        ]
    },
    {
        "name": "Medizinball/Kugelstossen",
        "discipline": "Kraft",
        "unit": "m", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [2.5, 3.5, 4.5],
                "medalThresholdsW": [2.5, 3.5, 4.5],
                "action": "Medizinball 1 kg"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [3, 4, 5],
                "medalThresholdsW": [3, 4, 5],
                "action": "Medizinball 1 kg"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [5.5, 6.5, 7.5],
                "medalThresholdsW": [5, 6, 7],
                "action": "Medizinball 1 kg"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [6.25, 6.75, 7.25],
                "medalThresholdsW": [4.75, 5.25, 5.75],
                "action":  "Kugelstossen 3kg"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [7, 7.5, 8],
                "medalThresholdsW": [5.5, 6, 6.5],
                "action": ["Kugelstossen 4kg", "Kugelstossen 3kg"]
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [7.5, 8, 8.5],
                "medalThresholdsW": [5.75, 6.25, 6.75],
                "action": ["Kugelstossen 5kg", "Kugelstossen 3kg"]
            }
        ]
    },
    {
        "name": "Standweitsprung",
        "discipline": "Kraft",
        "unit": "m", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [1.15, 1.35, 1.5],
                "medalThresholdsW": [1.05, 1.25, 1.4],
                "action": "Springen"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [1.3, 1.5, 1.65],
                "medalThresholdsW": [1.15, 1.3, 1.5],
                "action": "Springen"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [1.5, 1.7, 1.85],
                "medalThresholdsW": [1.3, 1.45, 1.65],
                "action": "Springen"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [1.7, 1.9, 2.05],
                "medalThresholdsW": [1.4, 1.6, 1.8],
                "action":  "Springen"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [1.9, 2.05, 2.25],
                "medalThresholdsW": [1.55, 1.7, 1.9],
                "action": "Springen"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [2.05, 2.2, 2.4],
                "medalThresholdsW": [1.65, 1.8, 2],
                "action": "Springen"
            }
        ]
    },
    {
        "name": "Geräteturnen (Kraft)",
        "discipline": "Kraft",
        "unit": "Erledigt", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Barren"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Reck"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Reck"
            }
        ]
    },
    {
        "name": "Laufen",
        "discipline": "Schnelligkeit",
        "unit": "sek", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [7.7, 6.8, 6],
                "medalThresholdsW": [8, 7.1, 6.3],
                "action": "30 m"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [7.2, 6.4, 5.7],
                "medalThresholdsW": [7.4, 6.6, 5.7],
                "action": "30 m"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [10.3, 9.3, 8.4],
                "medalThresholdsW": [11, 10.1, 9.1],
                "action": "50 m"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [9.7, 8.9, 8.1],
                "medalThresholdsW": [10.6, 9.6, 8.5],
                "action":  "50 m"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [17, 15.4, 14.1],
                "medalThresholdsW": [18.6, 17, 15.5],
                "action": "100 m"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [16.3, 14.8, 13.5],
                "medalThresholdsW": [17.6, 16.3, 15],
                "action": "100 m"
            }
        ]
    },
    {
        "name": "25 Meter Schwimmen",
        "discipline": "Schnelligkeit",
        "unit": "sek", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [46, 38, 30],
                "medalThresholdsW": [46.5, 38.5, 30.5],
                "action": "25 Meter Schwimmen"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [41, 33, 26],
                "medalThresholdsW": [42, 34, 28],
                "action": "25 Meter Schwimmen"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [36, 29, 22.5],
                "medalThresholdsW": [39, 31.5, 25.5],
                "action": "25 Meter Schwimmen"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [33, 27, 21],
                "medalThresholdsW": [35, 29, 23.5],
                "action":  "25 Meter Schwimmen"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [31, 25.5, 20],
                "medalThresholdsW": [33, 27.5, 21.5],
                "action": "25 Meter Schwimmen"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [29.5, 24.5, 19],
                "medalThresholdsW": [30.5, 25.5, 20],
                "action": "25 Meter Schwimmen"
            }
        ]
    },
    {
        "name": "200 Meter Radfahren",
        "discipline": "Schnelligkeit",
        "unit": "sek", 
        "expectations": [
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [38, 33, 28],
                "medalThresholdsW": [41, 36, 31],
                "action": "200 Meter Radfahren"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [35, 30.5, 26],
                "medalThresholdsW": [37, 32, 27],
                "action": "200 Meter Radfahren"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [29.5, 26, 22.5],
                "medalThresholdsW": [31, 27, 23.5],
                "action":  "200 Meter Radfahren"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [24, 21.5, 19],
                "medalThresholdsW": [27, 24.5, 21.5],
                "action": "200 Meter Radfahren"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [22, 19.5, 17],
                "medalThresholdsW": [25, 22.5, 20],
                "action": "200 Meter Radfahren"
            }
        ]
    },
    {
        "name": "Geräteturnen (Schnelligkeit)",
        "discipline": "Schnelligkeit",
        "unit": "Erledigt", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Sprung"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Sprung"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Sprung"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Sprung"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Sprung"
            }
        ]
    },
    {
        "name": "Hochsprung",
        "discipline": "Koordination",
        "unit": "m", 
        "expectations": [
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [0.85, 0.95, 1.05],
                "medalThresholdsW": [0.8, 0.9, 1],
                "action": "Hochsprung"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [0.95, 1.05, 1.15],
                "medalThresholdsW": [0.9, 1, 1.1],
                "action":  "Hochsprung"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [1.1, 1.2, 1.3],
                "medalThresholdsW": [0.95, 1.05, 1.15],
                "action": "Hochsprung"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [1.2, 1.3, 1.4],
                "medalThresholdsW": [1.05, 1.15, 1.25],
                "action": "Hochsprung"
            }
        ]
    },
    {
        "name": "Zonenweitsprung",
        "discipline": "Koordination",
        "unit": "Punkte", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [18, 21, 24],
                "medalThresholdsW": [18, 21, 24],
                "action": "Zonenweitsprung"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [27, 30, 33],
                "medalThresholdsW": [24, 27, 30],
                "action":  "Zonenweitsprung"
            }
            
        ]
    },
    {
        "name": "Weitsprung",
        "discipline": "Koordination",
        "unit": "m", 
        "expectations": [
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [2.6, 2.9, 3.2],
                "medalThresholdsW": [2.3, 2.6, 2.9],
                "action": "Weitsprung"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [3.2, 3.5, 3.8],
                "medalThresholdsW": [2.8, 3.1, 3.4],
                "action":  "Weitsprung"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [3.8, 4.1, 4.4],
                "medalThresholdsW": [3.2, 3.5, 3.8],
                "action": "Weitsprung"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [4.3, 4.6, 4.9],
                "medalThresholdsW": [3.4, 3.7, 4],
                "action": "Weitsprung"
            }
        ]
    },
    {
        "name": "Drehwurf",
        "discipline": "Koordination",
        "unit": "Punkte", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [15, 18, 24],
                "medalThresholdsW": [12, 15, 21],
                "action": "Drehwurf"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [21, 27, 33],
                "medalThresholdsW": [18, 21, 27],
                "action":  "Drehwurf"
            },
            {
                "ageFromTo": [10, 11],  
                "medalThresholdsM": [33, 39, 45],
                "medalThresholdsW": [27, 30, 36],
                "action":  "Drehwurf"
            }
            
        ]
    },
    {
        "name": "Schleuderwurf",
        "discipline": "Koordination",
        "unit": "m", 
        "expectations": [
            {
                "ageFromTo": [12, 13],  
                "medalThresholdsM": [19.5, 24, 27.5],
                "medalThresholdsW": [17, 19.5, 22],
                "action": "Schleuderwurf"
            },
            {
                "ageFromTo": [14, 15],  
                "medalThresholdsM": [23.5, 28, 32],
                "medalThresholdsW": [19.5, 22.5, 25.5],
                "action":  "Schleuderwurf"
            },
            {
                "ageFromTo": [16, 17],  
                "medalThresholdsM": [27.5, 32, 36.5],
                "medalThresholdsW": [22, 25, 28],
                "action":  "Schleuderwurf"
            }
            
        ]
    },
    {
        "name": "Seilspringen",
        "discipline": "Koordination",
        "unit": "Menge", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [10, 15, 25],
                "medalThresholdsW": [10, 15, 25],
                "action": "Grundsprung vorwärts mit oder ohne Zwischensprung ODER Galoppsprung"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [10, 15, 25],
                "medalThresholdsW": [10, 15, 25],
                "action":  "Grundsprung vorwärts mit oder ohne Zwischensprung ODER Galoppsprung"
            },
            {
                "ageFromTo": [10, 11],  
                "medalThresholdsM": [20, 30, 40],
                "medalThresholdsW": [20, 30, 40],
                "action":  "Grundsprung vorwärts ohne Zwischensprung"
            },
            {
                "ageFromTo": [12, 13],  
                "medalThresholdsM": [10, 20, 30],
                "medalThresholdsW": [10, 20, 30],
                "action": "Grundsprung rückwärts ohne Zwischensprung"
            },
            {
                "ageFromTo": [14, 15],  
                "medalThresholdsM": [10, 15, 20],
                "medalThresholdsW": [10, 15, 20],
                "action":  "Kreuzdurchschlag ohne Zwischensprung"
            },
            {
                "ageFromTo": [16, 17],  
                "medalThresholdsM": [10, 15, 20],
                "medalThresholdsW": [10, 15, 20],
                "action":  "Kreuzdurchschlag ohne Zwischensprung"
            }
            
        ]
    },
    {
        "name": "Geräteturnen (Koordination)",
        "discipline": "Koordination",
        "unit": "Erledigt", 
        "expectations": [
            {
                "ageFromTo": [6,7],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Schwebebalken"
            },
            {
                "ageFromTo": [8,9],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Reck"
            },
            {
                "ageFromTo": [10,11],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Ringe"
            },
            {
                "ageFromTo": [12,13],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            },
            {
                "ageFromTo": [14,15],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            },
            {
                "ageFromTo": [16,17],  
                "medalThresholdsM": [-1, -1, 0],
                "medalThresholdsW": [-1, -1, 0],
                "action": "Boden"
            }
        ]
    }

]`;
type DiscDict = { [key: string]: string[] };
export function getExercises(): DiscDict {
    let exercises = JSON.parse(basedata);
    let exercisesDict: DiscDict = {};
    for (let i = 0; i < exercises.length; i++) {
        let discipline = exercises[i].discipline;
        if (exercisesDict[discipline] == undefined) {
            exercisesDict[discipline] = [];
        }
        exercisesDict[discipline].push(exercises[i].name);
    }
    return exercisesDict;


}

export function calculateMedal(discipline: string, age: number, result: number, sex: string): string {
    //it is important to note that if the numbers in the expectation rise they must be attributed differently than if they were to fall
    let exerciseRegulations = JSON.parse(basedata);
    let exercise: Exercise | null = null;
    for (let i = 0; i < exerciseRegulations.length; i++) {
        if (exerciseRegulations[i].name == discipline) {
            exercise = exerciseRegulations[i];
            break;
        }
    }
    if (exercise == null) {
        return "keine passende disziplin";
    }
    let bracket: Expectation | null = null;
    for (let i = 0; i < exercise.expectations.length; i++) {
        if (exercise.expectations[i].ageFromTo.indexOf(age) > -1) {
            bracket = exercise.expectations[i];
            break;
        }
    }
    if (bracket == null) {
        return "keine passende alterskategorie!";
    }
    let expectationRising: boolean = false;
    if (bracket.medalThresholdsM[0] < bracket.medalThresholdsM[2]) {
        expectationRising = true;
    }
    if (sex == "f") {
        if ((result > bracket.medalThresholdsW[2] == expectationRising)) {
            return "gold";
        } else if ((result > bracket.medalThresholdsW[1] == expectationRising)) {
            return "silver";
        } else if ((result > bracket.medalThresholdsW[0] == expectationRising)) {
            return "bronze";
        } else {
            return "Keine medaille";
        }
    } else {
        if ((result > bracket.medalThresholdsM[2] == expectationRising)) {
            return "gold";
        } else if ((result > bracket.medalThresholdsM[1] == expectationRising)) {
            return "silver";
        } else if ((result > bracket.medalThresholdsM[0] == expectationRising)) {
            return "bronze";
        } else {
            return "Keine medaille";
        }
    }
}