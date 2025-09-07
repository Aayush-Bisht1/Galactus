import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

function CTA() {
    return (
    <section id='contact' className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* CTA Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Metro Operations?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join the future of intelligent public transportation. Our AI-powered scheduling system is ready to optimize your metro operations and improve passenger satisfaction.
            </p>
            
            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Free consultation and system analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Custom implementation for your metro system</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Ongoing support and optimization</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#0078B4]" />
                <span className="text-gray-700">hello@metro-ai-kochi.in</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-[#0078B4]" />
                <span className="text-gray-700">+91 9876543210</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-[#0078B4]" />
                <span className="text-gray-700">TBI, CUSAT Campus, Kochi</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Get Started Today
            </h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input 
                    placeholder="John" 
                    className="w-full rounded-xl border-gray-200 focus:border-[#0078B4] focus:ring-[#0078B4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input 
                    placeholder="Doe" 
                    className="w-full rounded-xl border-gray-200 focus:border-[#0078B4] focus:ring-[#0078B4]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full rounded-xl border-gray-200 focus:border-[#0078B4] focus:ring-[#0078B4]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <Input 
                  placeholder="Metro Rail Company" 
                  className="w-full rounded-xl border-gray-200 focus:border-[#0078B4] focus:ring-[#0078B4]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us about your metro system and how we can help..."
                  rows={4}
                  className="w-full rounded-xl border-gray-200 focus:border-[#0078B4] focus:ring-[#0078B4] resize-none"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#0078B4] to-[#00A651] text-white hover:opacity-90 rounded-xl py-3 text-lg font-medium group"
              >
                Send Message
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA