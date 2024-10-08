import MobileSidebar from '@/components/sidebar/MobileSidebar'
import Sidebar from '@/components/sidebar/sidebar'
import RoomProvider from '@/lib/providers/RoomProvider'
import React from 'react'
interface LayoutProps{
    children: React.ReactNode,
    params:any
}
function Layout({children,params}:LayoutProps) {
  return (
    <main className='flex overflow-hidden h-screen w-screen'>
    <Sidebar params={params} />
    <MobileSidebar>
      <Sidebar params={params} className='w-screen inline-block sm:hidden'/>
    </MobileSidebar>
    
    <div className='dark:border-Neutrals/neutrals-12/70  border-l-[1px] w-full relative '>
    <RoomProvider roomId={params.workspaceId}>
    {children}
    </RoomProvider>
      
    </div>
    </main>
  )
}

export default Layout