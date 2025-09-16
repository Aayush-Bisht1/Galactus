"use client";
import React from 'react'
import { Menu,X} from 'lucide-react'
type MenuBtnProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const MenuBtn = ({isMenuOpen,setIsMenuOpen}:MenuBtnProps) => {
  return (
    <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#0B2A3F]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
     </button>
  )
}

export default MenuBtn