import { z } from 'zod'

 export const SignupFormSchema = z.object({
      email: z.string().email({ message: 'Geben sie eine valide E-mail Adresse ein.' }).trim(),
   password: z
   .string()
//     .min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' })
//     .regex(/[a-zA-Z]/, { message: 'Muss mindestens einen Buchatben enthalten.' })
//     .regex(/[0-9]/, { message: 'Muss mindestens eine Zahl enthalten.' })
//     .regex(/[^a-zA-Z0-9]/, {
//       message: 'Muss mindestens ein Sonderzeichen enthalten.',
//     })
//     .trim(),
})

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Geben sie eine valide E-mail Adresse ein.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Dies ist kein valides Password.' })
    //.trim(),
})

export type FormState =
  | {
    errors?: {
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | undefined