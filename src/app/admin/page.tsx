"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
    const [key, setKey] = React.useState("")
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: key.trim() }),
            })

            if (res.ok) {
                router.push("/admin/dashboard")
            } else {
                setError("Invalid access key")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-white/5 border-white/10">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-gold/10 p-3 rounded-full w-fit mb-4">
                        <Lock className="w-6 h-6 text-gold" />
                    </div>
                    <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter Access Key"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="text-center tracking-widest"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Enter Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
