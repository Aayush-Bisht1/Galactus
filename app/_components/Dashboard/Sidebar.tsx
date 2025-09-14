import React from 'react'
import ListItem from './ListItem';
import {Home,ClipboardList,BarChart3,Wrench,Brush,Settings} from "lucide-react"
const sidebarLinks = [
  { title: "Dashboard", icon: "home" ,path:"/dashboard"},
  { title: "Train Allocation", icon: "train",path:"/dashboard/allocation" },
  { title: "Simulations", icon: "simulations",path:"/dashboard/simulations"},
  { title: "Maintenance", icon: "maintenance",path:"/dashboard/maintenance"},
  { title: "Cleaning", icon: "cleaning",path:"/dashboard/cleaning"},
  { title: "Admin", icon: "admin",path:"/dashboard/admin"},
];
const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <ul className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map((link, index) => (
          <li key={index}>
            <ListItem
              title={link.title}
              icon={link.icon}
              path={link.path}
            />
          </li>
        ))}
      </ul>

      
    </aside>
  )
}

export default Sidebar