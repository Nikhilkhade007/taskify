export const dynamic = "force-dynamic"
import MainEditor from '@/components/editor/MainEditor'
import { getWorkspaceDetails } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import React from 'react'

async function WorkspacePage({params}:{params:{workspaceId:string}}) {
  const {data,error} = await getWorkspaceDetails(params.workspaceId)
  if (error || !data.length) redirect("/dashboard")
  return (
    <div className='relative'>
      <MainEditor dirType="workspace" fileId={params.workspaceId} dirDetails={data[0] || []}/>
    </div>
  )
}

export default WorkspacePage