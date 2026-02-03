"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Instagram } from "lucide-react"

export default function AboutPage() {
    const [profileImage, setProfileImage] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (data.profileImage) {
                    setProfileImage(data.profileImage)
                }
            })
            .catch(err => {
                console.error("Failed to fetch profile:", err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    // Default fallback image
    const defaultImage = "https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1000&auto=format&fit=crop"
    const displayImage = profileImage || defaultImage

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Profile Image */}
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                            {isLoading ? (
                                <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
                                    <span className="text-gray-500">Loading...</span>
                                </div>
                            ) : (
                                <img
                                    src={displayImage}
                                    alt="Photographer Profile"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    </div>

                    {/* Bio Content */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Hi, I'm <span className="text-gold">Roop</span>
                        </h1>
                        <h2 className="text-xl text-gray-300 font-light">
                            Professional Photographer & Visual Storyteller
                        </h2>

                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                Photography is more than just clicking a button; it's about capturing the essence of a moment, the raw emotion, and the untold stories that lie within.
                            </p>
                            <p>
                                With years of experience behind the lens, I specialize in portrait, landscape, and event photography. My style is characterized by a blend of modern elegance and timeless beauty, always seeking the perfect light to illuminate your most cherished memories.
                            </p>
                            <p>
                                Whether it's a wedding, a personal portrait session, or a creative project, I am dedicated to delivering images that you will treasure for a lifetime.
                            </p>
                        </div>

                        <div className="pt-4">
                            <a
                                href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="gap-2">
                                    <Instagram className="w-4 h-4" />
                                    Follow on Instagram
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
