import { Mail, MapPin, Phone, Train } from 'lucide-react'
import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#0B2A3F] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0078B4] to-[#00A651] rounded-xl flex items-center justify-center">
                <Train className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Metro Optima</h3>
                <p className="text-sm text-white/60">Kochi Metro AI</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Transforming public transportation with AI-powered scheduling solutions. Making metro systems smarter, more efficient, and passenger-friendly.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Solutions</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#features" className="hover:text-[#00A651] transition-colors">AI Scheduling</a></li>
              <li><a href="#benefits" className="hover:text-[#00A651] transition-colors">Demand Forecasting</a></li>
              <li><a href="#" className="hover:text-[#00A651] transition-colors">Real-time Analytics</a></li>
              <li><a href="#" className="hover:text-[#00A651] transition-colors">Integration Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>hello@metro-ai-kochi.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>TBI, CUSAT Campus, Kochi</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © 2025 SmartRail AI. Revolutionizing metro operations.
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
      </footer>
  )
}

export default Footer