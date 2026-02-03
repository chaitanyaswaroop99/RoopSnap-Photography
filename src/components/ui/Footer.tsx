import Link from "next/link"
import { Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-400">
                            © RoopSnap Photography · All Rights Reserved
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a
                            href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gold transition-colors"
                        >
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </a>
                        <Link
                            href="/admin"
                            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
