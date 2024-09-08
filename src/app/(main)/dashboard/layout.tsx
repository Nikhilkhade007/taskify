import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import LiveBlockProvider from '@/lib/providers/liveblocksProvider'
import { SubscriptionModalProvider } from '@/lib/providers/subscription-model-provider'
import { getActiveProductsWithPrice } from '@/lib/supabase/queries'
import React from 'react'
interface layoutProps{
    children:React.ReactNode,
    params: any
}
async function Layout({children,params}:layoutProps) {
  const { data: products, error } = await getActiveProductsWithPrice();
  if (error) throw new Error();
  return (
    <main className='flex overflow-hidden h-screen'>
      <LiveBlockProvider>
      <SubscriptionModalProvider products={products}>
      <ToastProvider>
        {children}
        <Toaster/>
      </ToastProvider>
      </SubscriptionModalProvider>
      </LiveBlockProvider>
    </main>
  )
}

export default Layout