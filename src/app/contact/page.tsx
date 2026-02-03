"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.target as HTMLFormElement)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                alert("Message sent successfully!")
                    ; (e.target as HTMLFormElement).reset()
            } else {
                alert("Failed to send message.")
            }
        } catch (error) {
            alert("Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Get In <span className="text-gold">Touch</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Have a project in mind or just want to say hello? I'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-xl text-gold">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <Mail className="w-6 h-6 text-gold mt-1" />
                                    <div>
                                        <p className="font-medium text-white">Email</p>
                                        <p className="text-gray-400">Collab.roopsnap@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Phone className="w-6 h-6 text-gold mt-1" />
                                    <div>
                                        <p className="font-medium text-white">Phone</p>
                                        <p className="text-gray-400">+1 (332) 201-7020</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-gold mt-1" />
                                    <div>
                                        <p className="font-medium text-white">Location</p>
                                        <p className="text-gray-400">New York, NY</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-gold/20 to-black border border-gold/20">
                            <h3 className="text-lg font-semibold text-gold mb-2">Let's Create Magic</h3>
                            <p className="text-gray-300 text-sm">
                                "Photography is the story I fail to put into words."
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl">Send a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                                        <Input id="name" name="name" required placeholder="Your name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                                        <Input id="email" name="email" type="email" required placeholder="your@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone (Optional)</label>
                                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        className="flex min-h-[120px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-y"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
