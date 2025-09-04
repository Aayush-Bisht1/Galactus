import { Button } from '@/components/ui/button'
import { Menu, Train } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-xl text-foreground">
              KMRL SmartSched
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#challenge" className="text-muted-foreground hover:text-foreground transition-colors">
              Challenges
            </a>
            <a href="#solution" className="text-muted-foreground hover:text-foreground transition-colors">
              Solutions
            </a>
            <a href="#feature" className="text-muted-foreground hover:text-foreground transition-colors">
              features
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Button variant="default">
              Log in
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header