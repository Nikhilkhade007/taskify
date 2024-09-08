import RoomProvider from '@/lib/providers/RoomProvider'
import React from 'react'

function FileLayout({children,params:{fileId}}:{children:React.ReactNode,params:{fileId:string}}) {
  return (
    <RoomProvider roomId={fileId}>
        {children}
    </RoomProvider>
  )
}

export default FileLayout