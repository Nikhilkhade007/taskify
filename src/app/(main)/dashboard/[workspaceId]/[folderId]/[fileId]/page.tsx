import React from 'react'

function page({params}:{params:{fileId:string}}) {
  return (
    <div>
      FileId: {params.fileId}
    </div>
  )
}

export default page