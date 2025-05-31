import path from "path";
import { validateAndGetToken } from "./auth";
type pdfReturn = {
  message: string;
  path: string;
};
export async function createPdf(ids: number[]): Promise<string> {
  const token = validateAndGetToken();
  if (token === null || token === false) {
    // Token ist ungültig, validateAndGetToken leitet bereits weiter
    return "ungültiger Token";
  } else {
    let res: Response;
    if (ids.length == 0) {
      console.log("no input...");
      return "";
    } else if (ids.length == 1) {
      res = await fetch(
        "http://127.0.0.1:5000/athletes/" + ids[0] + "/export/pdf?year=2025",
        {
          cache: "no-store",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      if (!res.ok) {
        throw new Error(`API call failed: ${res.status}`);
      }
    } else {
      let appendage = "?ids=";
      appendage += ids.join(",");
      let fetchlink = "http://127.0.0.1:5000/gruppen/export/pdf" + appendage;
      console.log(fetchlink);
      res = await fetch(fetchlink, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`API call failed: ${res.status}`);
      }
    }

    const data: pdfReturn = await res.json();

    //Mapping
    let location = data.path;

    console.log(location);
    return location;
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

export async function downloadPdf(ids: number[]): Promise<boolean> {
  let filePath = getWebPath(await createPdf(ids));
  const link = document.createElement("a");
  link.href = filePath; // matches your express.static mount
  console.log(link.href);
  link.download = path.basename(filePath);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
}
