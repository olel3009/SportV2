"use server";

import { type AthleteFormValues } from "@/schemas/athlete-schema";

type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function createAthlete(data: any): Promise<ApiResponse> {
  try {
    const response = await fetch("YOUR_API_URL/athletes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fehler beim Erstellen des Athleten");
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
