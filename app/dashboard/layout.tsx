import React from 'react'
import Sidebar from '../_components/dashboard/Sidebar';
import Navbar from '../_components/dashboard/Navbar';
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='flex min-h-screen flex-col overflow-y-hidden '>
        <Navbar/>
        <div className='flex h-[90%] w-full'>
             <Sidebar />
        <main className='flex-1 p-6'>
            {children}
        </main>
        </div>
    </div>
  )
}

export default layout