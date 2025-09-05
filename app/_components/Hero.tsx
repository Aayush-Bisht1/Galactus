import { Button } from '@/components/ui/button'
import React from 'react'
import heroImage from '@/app/_assets/heroImage.png'
import caricatureImage from '@/app/_assets/cartoon.png'
import heroImage2 from '@/app/_assets/newHero.jpg'
import Image from 'next/image'
import { MoveLeft, MoveRight } from 'lucide-react'

function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Modern metro train in station with digital scheduling displays"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Intelligent Allocation <br />
                        <span className=" bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                            Management System
                            
                        </span>
                    </h1>
                    {/* Subheading */}
                    <p className="text-xl md:text-2xl  mb-8 text-primary-foreground/90 leading-relaxed">
                        Transform KMRL's train scheduling from manual processes to intelligent,
                        data-driven decisions with our comprehensive fleet optimization platform
                    </p>

                    {/* Key Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mb-12">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-accent">99.5%</div>
                            <div className="text-sm uppercase tracking-wide">Punctuality Target</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl flex items-center font-bold text-secondary">25<MoveRight/>40</div>
                            <div className="text-sm uppercase tracking-wide">Fleet Growth</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-accent">6</div>
                            <div className="text-sm uppercase tracking-wide">Critical Challenges</div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                            Log in 
                        </Button>
                        <Button variant="outline-hero" size="lg" className="text-lg px-8 py-6">
                            View Desciption
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default Hero