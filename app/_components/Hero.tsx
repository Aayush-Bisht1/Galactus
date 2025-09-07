import { Button } from '@/components/ui/button'
import React from 'react'
import heroImage from '@/app/_assets/heroImage.png'
import Image from 'next/image'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <Image
                    src={heroImage}
                    alt="Modern metro train station"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0078B4]/95 via-[#0078B4]/90 to-[#00A651]/95"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm">Live on Kochi Metro</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                        AI-Powered
                        <br />
                        <span className="text-[#00FFD1]">Metro Scheduling</span>
                    </h1>

                    <p className="text-xl lg:text-2xl opacity-90 mb-4 max-w-3xl mx-auto">
                        Reduce passenger wait times by 87% with intelligent train scheduling that adapts to real-time demand
                    </p>

                    <p className="text-lg opacity-75 mb-12 max-w-2xl mx-auto">
                        Transform your metro operations with AI that predicts passenger patterns and optimizes schedules automatically
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href='/login'>
                        <Button
                            size="lg"
                            className="bg-white text-[#0078B4] hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                            Get Started Today
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-xl px-8 py-4 text-lg font-medium group"
                        >
                            <Play className="mr-2 w-5 h-5" />
                            See How It Works
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🚇</span>
                            </div>
                            <span className="text-sm">Kochi Metro Rail</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-lg">⚡</span>
                            </div>
                            <span className="text-sm">Real-time Processing</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🎯</span>
                            </div>
                            <span className="text-sm">95% Accuracy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        </section>
    )
}

export default Hero