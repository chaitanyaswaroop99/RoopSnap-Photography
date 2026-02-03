import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const { key } = await request.json()
        // Fallback to 'roopsnap' if env var is not loaded yet (e.g. server not restarted)
        const ADMIN_KEY = process.env.ADMIN_ACCESS_KEY || "roopsnap"

        if (key && key.trim() === ADMIN_KEY) {
            // Set a cookie for the session
            const cookieStore = await cookies()
            cookieStore.set("admin_session", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            })

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ success: false }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
