import { Button } from "@/components/ui/Button"
import { Instagram } from "lucide-react"

// Placeholder for Instagram posts
const INSTAGRAM_POSTS = [
    { id: 1, src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop" },
    { id: 2, src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=500&auto=format&fit=crop" },
    { id: 3, src: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=500&auto=format&fit=crop" },
    { id: 4, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop" },
    { id: 5, src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=crop" },
    { id: 6, src: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?q=80&w=500&auto=format&fit=crop" },
]

export default function InstagramPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <div className="mb-12">
                    <Instagram className="w-16 h-16 text-gold mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        @roop_snap
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Follow my latest work and behind the scenes on Instagram.
                    </p>
                    <a
                        href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" className="gap-2">
                            Follow on Instagram
                        </Button>
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INSTAGRAM_POSTS.map((post) => (
                        <a
                            key={post.id}
                            href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-900"
                        >
                            <img
                                src={post.src}
                                alt="Instagram post"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="w-8 h-8 text-white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
