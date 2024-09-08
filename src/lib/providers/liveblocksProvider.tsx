'use client'
import React from 'react'
import {LiveblocksProvider} from "@liveblocks/react/suspense"
function LiveBlockProvider({
    children
}:{
    children:React.ReactNode
}) {
    if ( !process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set")
  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/api/liveblocks-auth"}>
        {children}
    </LiveblocksProvider>
  )
}

export default LiveBlockProvider