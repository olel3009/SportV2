export interface Athlete {
    id: number;
    firstName: string;
    lastName: string;
    sex: "m" | "w" | "d";
    dateOfBirth: string;
    goldMedals: number;
    silverMedals: number;
    bronzeMedals: number;
    disciplines?: string[];
    feats?: Array<Feat>
}

export interface Feat {
    id: number;
    athlete_id: number;
    rule_id: number;
    year: number;
    age: number;
    result: number;
    medal: string;
    created_at: string;
    updated_at: string;
    ruling: Rule|undefined;
}

export interface Rule{
    id: number;

    discipline_id: number;

    rule_name: string;

    description_m: string;
    description_f: string;

    unit: string;

    min_age: number;
    max_age: number;

    thresh_bronze_m: number;
    thresh_silver_m: number;
    thresh_gold_m: number;

    thresh_bronze_f: number;
    thresh_silver_f: number;
    thresh_gold_f: number;

    valid_start: Date;
    valid_end: Date;

    version:number;

    created_at:Date;
    updated_at:Date;
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