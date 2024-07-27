import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'
interface layoutProps{
    children:React.ReactNode,
    params: any
}
function Layout({children,params}:layoutProps) {
  return (
    <main className='flex overflow-hidden h-screen'>
      <ToastProvider>
        {children}
        <Toaster/>
      </ToastProvider>
        
    </main>
  )
}

export default Layout