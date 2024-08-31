import MainEditor from '@/components/editor/MainEditor'
import { getFolderDetails } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function FodlerPage({params}:{params:{folderId:string}}) {
  const {data,error} = await getFolderDetails(params.folderId)
  if (error || !data.length) redirect("/dashboard")
  return (
    <div className='relative'>
      <MainEditor dirDetails={data[0] || []} fileId={params.folderId} dirType='folder'/>
    </div>
  )
}
