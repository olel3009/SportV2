'use client'
import { SignupFormSchema, FormState, LoginFormSchema } from '@/app/definitions'
import { createUser, LoginKontrolle, userExists } from '../../generic_functions/user_getters'
import { redirect } from 'next/navigation'
import {} from '@/app/startpage'






export async function login(state: FormState, formData: FormData) {
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
    if (LoginKontrolle(mail, password) == 2) {
        console.log("login successful")
        
        redirect('/startpage')
        return {
            message: 'Login successful',
            email: ['Anmeldung erfolgreich.'],
            password: ['Anmeldung erfolgreich.'],
            errors: {
                email: ['Anmeldung erfolgreich.'],
                password: ['Anmeldung erfolgreich.'],
            }
        }
    } else {
        console.log("login failed")

        if (LoginKontrolle(mail, password) == 0) {
            return {
                errors: {
                    email: ['Es existiert kein Account mit dieser E-Mail Adresse'],
                }
            }
        }
        if (LoginKontrolle(mail, password) == 1) {
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
    })
    const mail = formData.get('email') as string;
    const password = formData.get('password') as string;
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    if (userExists(mail) == false) {

        if (createUser(mail, password) == true) {
            console.log("Signup Erfolgreich")
            return {
                message: 'Signup Erfolgreich',
            }
        }
    } else {
        console.log("login failed")
        if (userExists(mail) == true) {
            return {
                errors: {
                    email: ['Ein Account mit dieser E-Mail Adresse existiert bereits'],
                }
            }
        }
    }
}
