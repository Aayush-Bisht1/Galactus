"use client"
import React from 'react'
import Link from "next/link" 
import { usePathname } from 'next/navigation'
import {  LucideProps,Home,
  Train,
  BarChart2,
  Wrench,
  Brush,
  Settings } from 'lucide-react';

 const iconMap: Record<string, React.ElementType> = {
  home: Home,
  train: Train,
  simulations: BarChart2,
  maintenance: Wrench,
  cleaning: Brush,
  admin: Settings,
}
 interface ListItemprops {
    title:string;
    icon:string;
    path:string;
}
const ListItem = ({title,icon,path}:ListItemprops) => {
    const pathname = usePathname();
  const isActive = pathname === path;
  const IconComponent = iconMap[icon] || iconMap["home"]
  return (
    <div>
        
        <Link href={path}  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
        ${
          isActive
            ? "bg-emerald-100 text-emerald-700 font-medium"
            : "text-slate-600 hover:bg-gray-100 hover:text-emerald-700"
        }`} prefetch={true}>
            <IconComponent className={`w-5 h-5 ${isActive ? "text-emerald-700" : "text-slate-500"}`}
></IconComponent>
            <span>
                {title}
            </span>
        </Link>
    </div>
  )
}

export default ListItem