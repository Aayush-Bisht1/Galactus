import React from 'react'
import Sidebar from '@/app/_components/Dashboard/Sidebar';
import Navbar from '@/app/_components/Dashboard/Navbar';
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