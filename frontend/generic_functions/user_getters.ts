import { User} from "@/models/testusers";
import { get } from "http";

let mockupData = `[
    {
        "email": "test@test.com",
        "password": "testpassword*1"
    }
]`
export function getUsers(email: string): User| undefined {
    let translatedUsers: User[] = JSON.parse(mockupData);
    return translatedUsers.find(user => user.email === email);
}
export function LoginKontrolle(email: string, password: string): number {
    let translatedUsers: User[] = JSON.parse(mockupData);
    const user = translatedUsers.find(user => user.email === email);

    if (!user) {
        return 0; // Kein Benutzer mit dieser E-Mail-Adresse
    } else if (user.password !== password) {
        return 1; // Benutzer mit dieser E-Mail-Adresse gefunden, aber falsches Passwort
    } else {
        return 2; // Benutzer mit dieser E-Mail-Adresse und diesem Passwort gefunden
    }
}
export function userExists(email: string): boolean {
    let translatedUsers: User[] = JSON.parse(mockupData);
    return translatedUsers.some(user => user.email === email);
}
export function createUser(email: string, password: string): boolean {
    //A placeholder for the actual function that creates a user
    return true;
}