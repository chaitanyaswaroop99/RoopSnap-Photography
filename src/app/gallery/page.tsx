"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Lightbox } from "@/components/ui/Lightbox"

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
    const [images, setImages] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchPhotos() {
            try {
                const res = await fetch('/api/photos')
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                const text = await res.text()
                if (!text || text.trim() === '') {
                    setImages([])
                    return
                }
                const data = JSON.parse(text)
                if (Array.isArray(data)) {
                    setImages(data)
                } else {
                    setImages([])
                }
            } catch (error) {
                console.error("Failed to fetch photos", error)
                setImages([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchPhotos()
    }, [])

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Portfolio <span className="text-gold">Gallery</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A collection of moments frozen in time. Explore the world through my lens.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                    </div>
                ) : (
                    /* Masonry-style Grid (using CSS columns for simplicity) */
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
                                onClick={() => setSelectedImage(image.url)}
                            >
                                {image.url.startsWith('data:video') || image.url.match(/\.(mp4|webm)$/i) ? (
                                    <video
                                        src={image.url}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                        muted
                                        loop
                                        playsInline
                                        onMouseOver={e => e.currentTarget.play()}
                                        onMouseOut={e => e.currentTarget.pause()}
                                    />
                                ) : (
                                    <img
                                        src={image.url}
                                        alt={`Gallery image ${image.id}`}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                    <span className="text-white font-medium tracking-wider border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
                                        View
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <Lightbox
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage || ""}
            />
        </div>
    )
}
