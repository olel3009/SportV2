export interface Feat {
    discipline: string;
    exercise: string; 
    date: string;
    result: string;
    score: number;
}



export interface Athlete {
    id: number;
    firstName: string;
    lastName: string;
    sex: "m" | "w" | "d";
    dateOfBirth: string;
    disciplines?: string[];
    feats?: Array<Feat>
}

export interface Exercise {
    name: string; //eg. "800 m Lauf", "Schwimmen" usw.
    discipline: string; //eg. "Schnelligkeit", "Kraft" usw.
    unit: string; //eg. "m", "s" usw.
    expectations: Array<Expectation>;
}

export interface Expectation { 
    ageFromTo: [number, number];
    medalThresholdsM: [number, number, number]; //values for bronze, silver, gold
    medalThresholdsW: [number, number, number];
    action: [string, string]|string; //eg. "Medizinball (1kg)" usw. its [m, w] in the array
}