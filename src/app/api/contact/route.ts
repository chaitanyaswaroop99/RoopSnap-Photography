import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getMessages, saveMessages } from "@/lib/storage"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (supabase) {
            const { data, error } = await supabase.from('contact_messages').insert([body]).select()
            if (error) return NextResponse.json({ error: error.message }, { status: 500 })
            return NextResponse.json(data)
        }

        // Fallback to local JSON DB
        const messages = getMessages()
        const newMessage = {
            id: Date.now(),
            ...body,
            created_at: new Date().toISOString()
        }
        messages.unshift(newMessage)
        saveMessages(messages)

        return NextResponse.json({ success: true, data: newMessage })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET() {
    if (supabase) {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        if (!error && data) return NextResponse.json(data)
    }

    // Fallback to local JSON DB
    const messages = getMessages()
    // Sort by created_at desc
    messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())


    return NextResponse.json(messages)
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        // Try Supabase
        if (supabase) {
            const { error } = await supabase.from('contact_messages').delete().eq('id', id)
            if (!error) return NextResponse.json({ success: true })
        }

        // Fallback to local JSON DB
        const messages = getMessages()
        const newMessages = messages.filter((m: any) => m.id != id)

        if (newMessages.length !== messages.length) {
            saveMessages(newMessages)
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ success: false, error: "Message not found" })
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
