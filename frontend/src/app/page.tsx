"use client"
import { login, signup } from "./authlogin";
import { useActionState } from 'react'
import { useRouter } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";

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

function Error({ message }: { message: string }) {
  return (
    <Card className="bg-red-50 border border-red-200 text-red-700">
      <CardContent className="flex items-center gap-2 py-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <span>{message}</span>
      </CardContent>
    </Card>
  )
}

function LoginForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const router = useRouter(); // Router-Hook initialisieren

  return (
    <div className="flex flex-col gap-6">

      {(state?.errors?.email || state?.errors?.password) &&
        <Error message="Die angegebene E-Mail Adress oder das Passwort sind falsch."></Error>
      }
      <Card>
        <CardHeader>
          <CardTitle className="text-2x1">Login</CardTitle>
          <CardDescription>
            Geben Sie zum Einloggen ihre E-Mail Adresse und ihr Passwort an.<br />
            Falls Sie noch kein Account haben, drücken Sie auf den SignUp-Knopf.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
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
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="left" // Tooltip wird rechts angezeigt
                  align="center" // Zentriert den Tooltip vertikal zur Maus
                  sideOffset={10} // Abstand zwischen Tooltip und Maus
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
                >
                  Geben Sie hier ihre E-Mail Adresse ein.
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Passwort</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="left" // Tooltip wird rechts angezeigt
                  align="center" // Zentriert den Tooltip vertikal zur Maus
                  sideOffset={10} // Abstand zwischen Tooltip und Maus
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
                >
                  Geben Sie hier ihr Passwort ein.
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button type="submit" className="w-full" id="loginbutton">
                    Login
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="left" // Tooltip wird rechts angezeigt
                  align="center" // Zentriert den Tooltip vertikal zur Maus
                  sideOffset={10} // Abstand zwischen Tooltip und Maus
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
                >
                  Drücken Sie diesen Knopf, um sich mit den angegeben Daten einzuloggen.
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    type="button"
                    className="w-full"
                    id="signupbutton"
                    onClick={() => {
                      router.push("/signup");
                    }}
                  >
                    SignUp
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="left" // Tooltip wird rechts angezeigt
                  align="center" // Zentriert den Tooltip vertikal zur Maus
                  sideOffset={10} // Abstand zwischen Tooltip und Maus
                  className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
                >
                  Drücken sie diesen Knopf, um die SignUp Seite zu öffnen.
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Root>
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