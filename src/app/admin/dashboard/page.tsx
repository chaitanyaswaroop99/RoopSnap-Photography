"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Upload, MessageSquare, LogOut, Trash2, Loader2, Image as ImageIcon } from "lucide-react"

function MediaList() {
    const [media, setMedia] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/photos')
            const data = await res.json()
            if (Array.isArray(data)) setMedia(data)
        } catch (error) {
            console.error("Failed to fetch media")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchMedia()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return

        try {
            const res = await fetch('/api/photos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (res.ok) {
                setMedia(media.filter(item => item.id !== id))
            } else {
                alert("Failed to delete item")
            }
        } catch (error) {
            alert("Error deleting item")
        }
    }

    if (isLoading) return <div className="text-center py-4 text-gray-500">Loading media...</div>

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
                <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    {item.url.startsWith('data:video') || item.url.match(/\.(mp4|webm)$/i) ? (
                        <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                        <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-600 rounded-full hover:bg-red-700 text-white transition-colors shadow-lg"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function AdminDashboard() {
    const router = useRouter()
    const [messages, setMessages] = React.useState<any[]>([])
    const [isUploading, setIsUploading] = React.useState(false)
    const [uploadUrl, setUploadUrl] = React.useState("")
    const [category, setCategory] = React.useState("Portrait")
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/contact')
            const data = await res.json()
            if (Array.isArray(data)) setMessages(data)
        } catch (error) {
            console.error("Failed to fetch messages")
        }
    }

    const handleLogout = async () => {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        router.push("/admin")
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!uploadUrl) {
            alert("Please select a media file first")
            return
        }

        setIsUploading(true)

        try {
            const res = await fetch('/api/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: uploadUrl,
                    category,
                    created_at: new Date().toISOString()
                }),
            })

            const data = await res.json()

            if (res.ok && data.success) {
                alert("Media uploaded successfully!")
                setUploadUrl("")
                if (fileInputRef.current) fileInputRef.current.value = ""
                // Refresh the page to show the new media
                window.location.reload()
            } else {
                const errorMsg = data.error || data.details || "Failed to upload media"
                console.error("Upload error:", data)
                alert(`Failed to upload media: ${errorMsg}`)
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert(`Error uploading media: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-3xl font-bold text-white">Admin <span className="text-gold">Dashboard</span></h1>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Upload Section */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-gold" />
                                Upload Media
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Select Media</label>
                                    <div
                                        className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer bg-white/5"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*,video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setUploadUrl(reader.result as string)
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                        />
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">
                                            {uploadUrl ? "Media selected" : "Click to upload image or video"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, MP4, WebM</p>
                                    </div>
                                    {uploadUrl && (
                                        <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-black">
                                            {uploadUrl.startsWith('data:video') || uploadUrl.match(/\.(mp4|webm)$/i) ? (
                                                <video src={uploadUrl} className="w-full h-full object-cover" controls />
                                            ) : (
                                                <img src={uploadUrl} alt="Preview" className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setUploadUrl("")
                                                    if (fileInputRef.current) fileInputRef.current.value = ""
                                                }}
                                                className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-red-500/80 transition-colors z-10"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category</label>
                                    <select
                                        className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Portrait">Portrait</option>
                                        <option value="Landscape">Landscape</option>
                                        <option value="Event">Event</option>
                                        <option value="Nature">Nature</option>
                                    </select>
                                </div>

                                <Button type="submit" className="w-full" isLoading={isUploading} disabled={!uploadUrl}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Media
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Messages Section */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-gold" />
                                Recent Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No messages yet
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-gold/30 transition-colors relative group">
                                            <div className="flex justify-between items-start mb-2 pr-8">
                                                <h4 className="font-medium text-white">{msg.name}</h4>
                                                <span className="text-xs text-gray-500">{new Date(msg.created_at || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gold/80 mb-1">{msg.email}</p>
                                            {msg.phone && <p className="text-sm text-gray-400 mb-2">{msg.phone}</p>}
                                            <p className="text-sm text-gray-300">{msg.message}</p>

                                            <button
                                                onClick={async () => {
                                                    if (!confirm("Delete this message?")) return
                                                    try {
                                                        const res = await fetch('/api/contact', {
                                                            method: 'DELETE',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ id: msg.id }),
                                                        })
                                                        if (res.ok) {
                                                            setMessages(prev => prev.filter(m => m.id !== msg.id))
                                                        } else {
                                                            alert("Failed to delete message")
                                                        }
                                                    } catch (error) {
                                                        alert("Error deleting message")
                                                    }
                                                }}
                                                className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Media List Section */}
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-gold" />
                            Manage Media
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MediaList />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
