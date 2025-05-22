
import { validateAndGetToken } from "./auth";

type RawUser = {
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

//Mit Backend verbunden
export async function getUsers(): Promise<RawUser[]> {
    if (validateAndGetToken() != true) {
        console.log("No access token found");
        return [];
    }else{
const res = await fetch("http://127.0.0.1:5000/users", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token")
        },
        method: "GET",
        cache: "no-store"
    });
    if (!res.ok) {
        throw new Error(`API call failed: ${res.status}`);
    }
    const data: RawUser[] = await res.json();
    const mapped: RawUser[] = data.map((raw) => ({
        email: raw.email,
        password: raw.password,
        created_at: new Date(raw.created_at),
        updated_at: new Date(raw.updated_at),
    }));
    return mapped;
    }
    
    
}

//Mit Backend verbunden
export async function LoginKontrolle(email: string, password: string): Promise<number> {
    console.log("LoginKontrolle")
        try {
            const res = await fetch("http://127.0.0.1:5000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });
            if (!res.ok) {
                const errorBody = await res.json();
                console.log("Login failed:", errorBody);
                return 0; // Fehler bei der Überprüfung des Benutzers
                throw new Error(errorBody.error || "Failed to add result");
            } else {
                const data = await res.json();
                //console.log("Login response:", data);
                if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
                //const token = localStorage.getItem("access_token");
                //console.log(token); // zeigt den JWT-Token im Browser-Log an
                //console.log(data.access_token);
                }

                console.log("Login successful");
                return 2; // Login erfolgreich
            }
        } catch (error) {
            console.error("Error during user login:", error);
            return 0; // Fehler bei der Überprüfung des Benutzers
        }
}



//Mit Backend verbunden
export async function userExists(email: string): Promise<boolean> {
    const allUsers = await getUsers();
    return allUsers.some((user) => user.email === email);
}



//Bisher noch Fehlerhaft
export async function createUser(email: string, password: string): Promise<boolean> {
    const res = await fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });

    if (!res.ok) {
        return false; // User creation failed
    } else {
        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        console.log("User created successfully");
        return true; // User creation successful
    }
}