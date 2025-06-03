import path from "path";
import { validateAndGetToken } from "./auth";

export default async function uploadSwimCert(athlete_id: number, file: File): Promise<string | null> {
  const token = validateAndGetToken();
  if (token === null || token === false) {
    // Token ist ungültig, validateAndGetToken leitet bereits weiter
    let errorMsg = "Token ist ungültig";
    return errorMsg; // Fehlertext zurückgeben
  } else {
    const formData = new FormData();
    formData.append("swim_cert_file", file);
    const res = await fetch(`http://127.0.0.1:5000/athletes/${athlete_id}/upload_swim_cert`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token")
      },
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = "Unbekannter Fehler";
      try {
        const error = await res.json();
        errorMsg = error.error || JSON.stringify(error);
      } catch (e) {
        errorMsg = res.statusText;
      }
      console.log("Error adding rule:", errorMsg);
      return errorMsg; // Fehlertext zurückgeben
    } else {
      console.log("Rule added successfully");
      return null; // kein Fehler
    }
  }
}

function getWebPath(filePath: string): string {
  const prefixToRemove = "frontend/public/";
  if (filePath.startsWith(prefixToRemove)) {
    return "/" + filePath.substring(prefixToRemove.length);
  }
  // If the prefix isn't there, but "public/" is, handle that too
  const publicPrefix = "public/";
  if (filePath.startsWith(publicPrefix)) {
    return "/" + filePath.substring(publicPrefix.length);
  }
  // If it already starts with a slash, assume it's a web path
  if (filePath.startsWith("/")) {
    return filePath;
  }
  // Otherwise, prepend a slash assuming it's relative to public root
  return "/" + filePath;
}

export async function downloadSwimCert(cert_path: string) {
  let filePath = getWebPath("frontend/public/downloadFiles/uploads/" + cert_path);
    const link = document.createElement("a");
    link.href = filePath; // matches your express.static mount
    console.log(link.href);
    link.download = path.basename(filePath);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    return true;
}