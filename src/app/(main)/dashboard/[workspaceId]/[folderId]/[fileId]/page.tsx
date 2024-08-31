import MainEditor from '@/components/editor/MainEditor'
import { getFileDetails } from '@/lib/supabase/queries'
import React from 'react'

async function page({params}:{params:{fileId:string}}) {
  const {data,error} = await getFileDetails(params.fileId)
  if (error || !data.length) return
  return (
    <div className='relative'>
      <MainEditor  dirDetails={data[0] || []} fileId={params.fileId} dirType='file'/>
    </div>
  )
}

export default page