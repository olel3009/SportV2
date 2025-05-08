"use client"
import { login, signup } from "./authlogin";
import { useActionState } from 'react'
import ErrorDisplay from "@/components/ErrorDisplay";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <div className="flex flex-col gap-6">
      
      {(state?.errors?.email || state?.errors?.password) &&
        <ErrorDisplay message="Die angegebene E-Mail oder das Passwort sind falsch."></ErrorDisplay>
      }

      <Card>
        <CardHeader>
          <CardTitle className="text-2x1">Login</CardTitle>
          <CardDescription>
            Geben Sie zum Einloggen ihre E-Mail Adresse an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m.mustermann@beispiel.de"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" id= "loginbutton">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex items-center h-full justify-center md:px-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}