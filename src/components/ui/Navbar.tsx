"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Instagram, Camera } from "lucide-react"
import { Button } from "./Button"

const navItems = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Camera className="h-6 w-6 text-gold" />
                            <span className="text-xl font-bold text-white tracking-wider">ROOP SNAP</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-gold",
                                        pathname === item.href ? "text-gold" : "text-gray-300"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <a
                                href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-gold transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block rounded-md px-3 py-2 text-base font-medium hover:bg-white/10 hover:text-gold",
                                    pathname === item.href ? "text-gold" : "text-gray-300"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <a
                            href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-gold"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}
