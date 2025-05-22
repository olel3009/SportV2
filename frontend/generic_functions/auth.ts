
export function validateAndGetToken(): boolean | null {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/?error=notoken";
        return null;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem("access_token");
            window.location.href = "/?error=tokenexpired";
            return null;
        }
    } catch (e) {
        localStorage.removeItem("access_token");
        window.location.href = "/?error=invalidtoken";
        return null;
    }
    return true;
}