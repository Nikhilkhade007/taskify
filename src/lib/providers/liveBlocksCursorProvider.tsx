'use client'
import FollowPointer from '@/components/global/FollowPointer'
import { useMyPresence, useOthers } from '@liveblocks/react/suspense'
import React,{PointerEvent} from 'react'
interface LiveCursorProviderProps{
  children:React.ReactNode
}
function LiveCursorProvider({children}:LiveCursorProviderProps) {
  const [myPresence,updateMyPresence] = useMyPresence()
  const others  = useOthers()
  function handlePointerMove(e:PointerEvent<HTMLDivElement>){
    const cursor = { x:Math.floor(e.pageX),y:Math.floor(e.pageY)}
    updateMyPresence({cursor})
  }
  function handlePointerLeave(){
    updateMyPresence({cursor:null})
  }
  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others.filter((other)=>other.presence.cursor !== null).map(({connectionId,presence,info})=>(
        <FollowPointer key={connectionId} x={presence.cursor!.x} info={info} y={presence.cursor!.y}/>

      ))}
      {children}
    </div>
  )
}

export default LiveCursorProvider