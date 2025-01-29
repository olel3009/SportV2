export interface Athlete {
    id: number;
    firstName: string;
    lastName: string;
    sex: "m" | "w" | "d";
    dateOfBirth: string;
    disciplines?: string[];
    feats?: Array<{
        discipline: string;
        exercise: string; 
        date: string;
        result: string;
        score: number;
    }>
}
