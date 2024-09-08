import RoomProvider from '@/lib/providers/RoomProvider'
import React from 'react'

function Folderlayout({children,params:{folderId}}:{children:React.ReactNode,params:{folderId:string}}) {
  return (
    <RoomProvider roomId={folderId}>
        {children}
    </RoomProvider>
  )
}

export default Folderlayout