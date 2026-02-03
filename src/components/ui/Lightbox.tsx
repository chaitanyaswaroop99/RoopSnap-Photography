"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LightboxProps {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt?: string
}

export function Lightbox({ isOpen, onClose, imageSrc, imageAlt = "Gallery Image" }: LightboxProps) {
    // Prevent scrolling when lightbox is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-video mx-4" onClick={(e) => e.stopPropagation()}>
                        {imageSrc.startsWith('data:video') || imageSrc.match(/\.(mp4|webm)$/i) ? (
                            <video
                                src={imageSrc}
                                className="w-full h-full object-contain"
                                controls
                                autoPlay
                            />
                        ) : (
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
