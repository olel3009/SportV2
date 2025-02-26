"use client"
import styles from "./page.module.css";
import { login, signup } from "./authlogin";
import { useActionState } from 'react'





export default function Login() {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <div className={styles.page}>
      <h1>Login</h1>
      <div className="login-box">
        <form action={action}>
          <div>
            <label htmlFor="email">E-mail Adresse: <br /></label>
            <input id="email" name="email" type="email" placeholder="E-mail Adresse" />
          </div>
          {state?.errors?.email && <p>{state.errors.email}</p>}
          <p><br /></p>
          <div>
            <label htmlFor="password">Password: <br /></label>
            <input id="password" name="password" type="password" placeholder="Password" />
          </div>
          {state?.errors?.password && (
            <div>
              <p>Password:</p>
              <ul>
                {state.errors.password.map((error: any) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
          <p><br /></p>
          <button disabled={pending} id="loginbutton" type="submit" name="loginbutton">Login</button>
        </form>
      </div>
    </div>
  );
}