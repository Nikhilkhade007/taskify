'use client'
import { workspace } from '@/lib/supabase/supabase.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import taskifyLogo from '../../../public/taskifyLogo.svg'
import Link from 'next/link';
import Image from 'next/image';
interface SelectedWorkspaceProps{
    workspace: workspace;
    onClick?:(option:workspace)=> void
}
function SelectedWorkspace({workspace,onClick}:SelectedWorkspaceProps) {
    const supabase = createClientComponentClient();
    const [workspaceLogo,setWorkspaceLogo] = useState('/taskifyLogo.svg')
    useEffect(()=>{
      if (workspace.logo){
        const path = supabase.storage.from('workspace-logos').getPublicUrl(workspace.logo)?.data.publicUrl;
        setWorkspaceLogo(path)
      }
    },[workspace])
  return (
    <Link  href={`/dashboard/${workspace.id}`}
    onClick={() => {
      if (onClick) onClick(workspace);
    }}
    className='rounded-md flex hover:bg-muted transition-all w-full flex-row p-2 justify-center cursor-pointer my-2 items-center gap-4'>
      <Image src={workspaceLogo} alt='workspace logo' width={26} height={26} className=' object-cover'/>
      <div className='flex flex-col'>
        <p className='w-[170px] overflow-hidden overflow-ellipsis text-lg whitespace-nowrap'>
          {workspace.title}
        </p>
      </div>
    </Link>
  )
}

export default SelectedWorkspace