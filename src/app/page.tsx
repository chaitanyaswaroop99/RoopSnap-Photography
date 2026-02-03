import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Phone, Instagram } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            RoopSnap <span className="text-gold">Photography</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Modern portrait and event photography focused on real moments, natural expressions, and timeless imagery.
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-gray-200 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <a href="tel:3322017020" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="h-5 w-5" />
              <span>332-201-7020</span>
            </a>
            <a 
              href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span>@roop_snap</span>
            </a>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            <p className="text-lg text-gold font-medium">Now accepting sessions</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            About
          </h2>
          <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
            <p>
              At RoopSnap Photography, we create elegant portraits and event imagery that feel natural, refined, and timeless.
            </p>
            <p>
              Every session is approached with care, creativity, and attention to detail to ensure your moments are captured beautifully.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center tracking-tight">
            Services
          </h2>
          <p className="text-xl text-gray-300 mb-12 text-center">
            Capturing meaningful moments across
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Birthdays",
              "Special Occasions",
              "Weddings",
              "Newborns",
              "Engagements",
              "Graduations",
              "Housewarming Celebrations"
            ].map((service) => (
              <div
                key={service}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-300"
              >
                <p className="text-white text-lg font-medium">• {service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center tracking-tight">
            Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 hover:border-gold/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gold">Starter Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">1 hour · 10–15 edited photos</p>
                <p className="text-2xl font-bold text-white">Starting at $150</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-gold/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gold">Standard Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">2–3 hours · 25–45 edited photos</p>
                <p className="text-2xl font-bold text-white">Starting at $250</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-gold/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gold">Premium Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">5 hours · 60+ retouched photos</p>
                <p className="text-2xl font-bold text-white">Starting at $1000</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-gold/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gold">Event Coverage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">Full-day coverage for weddings and events</p>
                <p className="text-2xl font-bold text-white">Starting at $3000</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Thank you for choosing <span className="text-gold">RoopSnap Photography</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Now accepting bookings.
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-gray-200">
            <a href="tel:3322017020" className="flex items-center gap-2 hover:text-gold transition-colors text-lg">
              <Phone className="h-5 w-5" />
              <span>332-201-7020</span>
            </a>
            <a 
              href="https://www.instagram.com/roop_snap?igsh=MWxzeGt4d3ExaG40Zw%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors text-lg"
            >
              <Instagram className="h-5 w-5" />
              <span>@roop_snap</span>
            </a>
          </div>

          <Link href="/contact">
            <Button size="lg" className="min-w-[200px]">
              Book a Session
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
