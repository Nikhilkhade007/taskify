'use client'
import React from 'react'
import { ClientSideSuspense,
    RoomProvider as RoomProviderWrapper
 } from '@liveblocks/react/suspense'
import Loader from '@/components/global/Loader'
import LiveCursorProvider from './liveBlocksCursorProvider'
function RoomProvider({roomId,children}:{
    children:React.ReactNode,
    roomId:string
}) {
  return (
    <RoomProviderWrapper id={roomId} initialPresence={{
        cursor:null
    }}>
        <ClientSideSuspense fallback={(
            <div className='flex items-end justify-center'>
                <Loader/>
            </div>
        )}>
            <LiveCursorProvider>
                {children}
            </LiveCursorProvider>
        </ClientSideSuspense>
    </RoomProviderWrapper>
  )
}

export default RoomProvider