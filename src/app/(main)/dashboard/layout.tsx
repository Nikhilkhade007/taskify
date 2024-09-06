import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
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
      <SubscriptionModalProvider products={products}>
      <ToastProvider>
        {children}
        <Toaster/>
      </ToastProvider>
      </SubscriptionModalProvider>
    </main>
  )
}

export default Layout