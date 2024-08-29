
import {  createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { cookies } from 'next/headers';
import { getFolders, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import { getPrivateWorkspaces,getCollaboratingWorkspaces,getSharedWorkspaces } from '@/lib/supabase/queries';
import { twMerge } from 'tailwind-merge';
import DropdownWorkspace from './DropdownWorkspace';
import PlanUsage from './PlanUsage';
import NativeNavigation from './NativeNavigation';
import FoldersDropdownList from './FolderDropdownList';
import { ScrollArea } from '../ui/scroll-area';
interface SidebarProps{
    params:{
        workspaceId: string
    };
    className?: string;
}
async function Sidebar({params,className}:SidebarProps) {
    const supabase = createServerComponentClient({cookies})
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return 
    const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);
    const {data:folderData,error:folderError} = await getFolders(params.workspaceId)
    if (subscriptionError || folderError) redirect('/dashboard');
    const [privateWorkspaces,collaboratingWorkspaces,sharedWorkspaces] = await Promise.all([getPrivateWorkspaces(user.id),getCollaboratingWorkspaces(user.id),getSharedWorkspaces(user.id)])
    const { data: workspaceFolderData, error: foldersError } = await getFolders(
        params.workspaceId
      );
  return (
    <aside className={twMerge('hidden sm:flex sm:flex-col sm:items-center relative shrink-0 sm:gap-4 w-[280px] !justify-between',className)}>
        <div>
            <DropdownWorkspace sharedWorkspaces={sharedWorkspaces} collaboratingWorkspaces={collaboratingWorkspaces} privateWorkspaces={privateWorkspaces} defaultValue={[...privateWorkspaces,
                ...collaboratingWorkspaces,
                ...sharedWorkspaces
            ].find((workspace)=> workspace.id === params.workspaceId)}/>
            <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <NativeNavigation myWorkspaceId={params.workspaceId} />
        <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          />
        {/* <ScrollArea
          className="relative
          h-[450px]
        "
        >
          <div
            className="pointer-events-none 
          w-full 
          bottom-0 
          h-20 
          bg-gradient-to-t 
          from-background 
          to-transparent 
          z-40"
          />
          
          
        </ScrollArea> */}
        </div>
    </aside>
  )
}

export default Sidebar