"use client"
import { Button } from '@/components/ui/button'
import { Menu, Train, X } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'
import MenuBtn from './MenuBtn'
import Loginbtn from './Loginbtn'
import Link from 'next/link'
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Contact', href: '#contact' },
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0078B4] to-[#00A651] rounded-xl flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B2A3F]">Metro Optima</h1>
              <p className="text-xs text-[#0B2A3F]/60">Kochi Metro AI</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a href={item.href} key={item.label}
              >
                <div
                  className="text-[#0B2A3F]/80 hover:text-[#0078B4] transition-colors font-medium" 
                >
                  {item.label}
                </div>
              </a>
            ))}
            
          
            <Loginbtn/>
            
            <Link href={'/login'}>
            <Button
              className="flex items-center bg-gradient-to-r from-[#0078B4] to-[#00A651] text-white hover:opacity-90 rounded-xl px-6"
            >
              Log In
            </Button>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <MenuBtn isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} /> 
          
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a href={item.href} key={item.label}
                >
                  <div className="text-left text-[#0B2A3F]/80 hover:text-[#0078B4] transition-colors font-medium py-2">
                    {
                      item.label
                    }
                  </div>
                </a>
              ))}

                <Loginbtn/>

              <Link href={'/login'}>
              <Button
                className="flex items-center bg-gradient-to-r from-[#0078B4] to-[#00A651] text-white hover:opacity-90 rounded-xl mt-2"
              >
                Log In
              </Button>
              </Link>

            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header