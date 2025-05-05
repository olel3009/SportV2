import { Card, CardContent } from "./ui/card"
import { AlertCircle } from "lucide-react"

export default function ErrorDisplay({message}: {message: string}) {
  return (
    <Card className="bg-red-50 border border-red-200 text-red-700">
      <CardContent className="flex items-center gap-2 py-3">
        <AlertCircle className="h-5 w-5 text-red-600"/>
        <span>{message}</span>
      </CardContent>
    </Card>
  )
}