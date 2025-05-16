import * as z from "zod";

export const athleteFormSchema = z.object({
  first_name: z.string().min(1, "Vorname ist erforderlich"),
  last_name: z.string().min(1, "Nachname ist erforderlich"),
  birth_date: z.date({
    required_error: "Geburtsdatum ist erforderlich",
  }),
  gender: z.enum(["m", "f", "d"], {
    required_error: "Geschlecht ist erforderlich",
  }),
  swim_certificate: z.boolean().default(false),
});

export type AthleteFormValues = z.infer<typeof athleteFormSchema>;
