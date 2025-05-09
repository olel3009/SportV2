'use client'
import { SignupFormSchema, FormState, LoginFormSchema } from '@/app/definitions'
import { createUser, LoginKontrolle, userExists } from '../../generic_functions/user_getters'
import { redirect } from 'next/navigation'







export async function login(state: FormState, formData: FormData) {
    console.log("Login");
    // If any form fields are invalid, return early
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    //Test Login Data and test return

    const mail = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (await LoginKontrolle(mail, password) == 2) {
        console.log("login successful")
        redirect('/dashboard')
    } else {
        console.log("login failed")

        if (await LoginKontrolle(mail, password) == 0) {
            return {
                errors: {
                    email: ['Es existiert kein Account mit dieser E-Mail Adresse'],
                }
            }
        }
        if (await LoginKontrolle(mail, password) == 1) {
            return {
                errors: {
                    password: ['Das Passwort ist falsch'],
                }
            }
        }
    }
}



export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        password2: formData.get('password2'),
    })
    const mail = formData.get('email') as string;
    const password = formData.get('password') as string;
    const password2 = formData.get('password2') as string;
    
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: { passwordlänge: ['Das Passwort muss mindestens 8 Zeichen lang sein.'],
            }
        }
    }

    if (await userExists(mail) == false) {
        if (password != password2) {
            return {
                errors: {
                    password: ['Die Passwörter sind nicht gleich'],
                }
            }
        } else {
            if (await createUser(mail, password) == true) {
                console.log("Signup Erfolgreich")
                redirect('/dashboard')
                return {
                    message: 'Signup Erfolgreich',

                }
            }
            else {
                console.log("SignUp Fehlgeschlagen")
                if (await userExists(mail) == true) {
                    return {
                        errors: {
                            email: ['Ein Account mit dieser E-Mail Adresse existiert bereits'],
                        }
                    }
                } else {
                    return {
                        errors: {
                            email: ['SignUp Fehlgeschlagen'],
                        }
                    }
                }
            }
        }
    }else {
        return {
            errors: {
                email: ['Ein Account mit dieser E-Mail Adresse existiert bereits'],
            }
        }
    }
}
