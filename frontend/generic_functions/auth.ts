
export function validateAndGetToken(): boolean | null {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
        // Nicht im Browser, Token kann nicht geprüft werden
        return null;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/?error=notoken";
        return false;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem("access_token");
            window.location.href = "/?error=tokenexpired";
            return false;
        }
    } catch (e) {
        localStorage.removeItem("access_token");
        window.location.href = "/?error=invalidtoken";
        return false;
    }
    return true;
}