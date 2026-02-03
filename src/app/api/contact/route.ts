import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getMessages, saveMessages } from "@/lib/storage"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Try MongoDB first if configured
        if (process.env.MONGODB_URI) {
            try {
                const db = await getDb()
                const newMessage = {
                    ...body,
                    created_at: new Date().toISOString()
                }
                
                const result = await db.collection('contact_messages').insertOne(newMessage)
                
                const savedMessage = {
                    id: result.insertedId.toString(),
                    ...newMessage
                }
                
                return NextResponse.json({ success: true, data: savedMessage })
            } catch (mongoError) {
                console.error("MongoDB error:", mongoError)
                return NextResponse.json({ error: "Database error", details: mongoError instanceof Error ? mongoError.message : "Failed to save message" }, { status: 500 })
            }
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
        console.error("Contact POST error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET() {
    try {
        // Try MongoDB first if configured
        if (process.env.MONGODB_URI) {
            try {
                const db = await getDb()
                const messages = await db.collection('contact_messages')
                    .find({})
                    .sort({ created_at: -1 })
                    .toArray()
                
                // Convert MongoDB _id to id for compatibility
                const formattedMessages = messages.map((msg: any) => ({
                    id: msg._id.toString(),
                    name: msg.name,
                    email: msg.email,
                    phone: msg.phone,
                    message: msg.message,
                    created_at: msg.created_at
                }))
                
                return NextResponse.json(formattedMessages)
            } catch (mongoError) {
                console.error("MongoDB error:", mongoError)
                // Fall through to local storage
            }
        }

        // Fallback to local JSON DB
        const messages = getMessages()
        // Sort by created_at desc
        messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        return NextResponse.json(messages)
    } catch (error) {
        console.error("Contact GET error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()

        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 })
        }

        // Try MongoDB first if configured
        if (process.env.MONGODB_URI) {
            try {
                const db = await getDb()
                const { ObjectId } = await import('mongodb')
                
                // Handle both MongoDB ObjectId and string IDs
                let queryId
                try {
                    queryId = new ObjectId(id)
                } catch {
                    queryId = id // If not a valid ObjectId, use as string
                }
                
                const result = await db.collection('contact_messages').deleteOne({ _id: queryId })
                
                if (result.deletedCount === 0) {
                    // Try deleting by string ID if ObjectId didn't work
                    const stringResult = await db.collection('contact_messages').deleteOne({ _id: id })
                    if (stringResult.deletedCount === 0) {
                        return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 })
                    }
                }
                
                return NextResponse.json({ success: true })
            } catch (mongoError) {
                console.error("MongoDB error:", mongoError)
                return NextResponse.json({ error: "Database error" }, { status: 500 })
            }
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
        console.error("Contact DELETE error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
