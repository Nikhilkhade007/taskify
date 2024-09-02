

'use client'
import { useAppState } from '@/lib/providers/state-provider'
import { Folder } from '@/lib/supabase/supabase.types';
import React, { useEffect, useState } from 'react'
import TooltipComponent from '../global/tooltip-component';
import { Plus } from 'lucide-react';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { v4 } from 'uuid';
import { createFolder } from '@/lib/supabase/queries';
import { toast } from '../ui/use-toast';
import { Accordion } from '../ui/accordion';
import Dropdown from './Dropdown';
import useSupabaseRealtime from '@/lib/hooks/UseSupabaseRealtime';
interface FolderDropdownListProps{
  workspaceFolders:Folder[];
  workspaceId:string;
}
function FolderDropdownList({workspaceFolders,workspaceId}:FolderDropdownListProps) {
  useSupabaseRealtime()
  const {state,dispatch,folderId} = useAppState();
  const {subscription} = useSupabaseUser()
  const [folders,setFolders] = useState<Folder[] | []>([])
  //onclick
  const hadleAddFolder = async()=>{
    if (folders.length >= 3 && !subscription){
      return
    }
    const newFolder:Folder = {
      id:v4(),
      data: "",
      createdAt: new Date().toISOString(),
      workspaceId:workspaceId,
      title:"Untitled",
      iconId:"📁",
      bannerUrl :"",
      inTash:""
    }
    dispatch({
      type:"ADD_FOLDER",
      payload:{
        workspaceId,folder:{...newFolder,files:[]}
      }
    })
    const {data,error} = await createFolder(newFolder)
    if (error){
      toast({
        title:"Error!!!",
        description:"Failed to create folder",
        variant:"destructive"
      })
    }else{
      toast({
        title:"success",
        description:"Folder created successfully",
      })
    }
  }

  //useEffect
  useEffect(()=>{
    if (workspaceFolders.length > 0){
      dispatch({
        type:"SET_FOLDERS",
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder)=>({
            ...folder,
            files:state.workspaces.find(workspace=> workspace.id === workspaceId)?.folders.find((f)=> f.id === folder.id)?.files || []
          }))
        }
      })
    }
  },[workspaceId,workspaceFolders])
  useEffect(()=>{
    setFolders(state.workspaces.find(worksapce=>worksapce.id === workspaceId)?.folders || [])
  },[state,workspaceId])
  return (
    <>
    <div className='flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8'>
      <span className='text-Neutrals/neutrals-8 font-bold text-xs'>FOLDERS</span>
      <TooltipComponent message='Create folder'>
        <Plus size={14} onClick={hadleAddFolder} className='group-hover/title:inline-block hidden cursor-pointer'/>
      </TooltipComponent>
    </div>
    <Accordion type='multiple' defaultValue={[folderId || ""]} className='pb-20'>
        {folders.filter(folder=> !folder.inTash).map(folder=>(
          <Dropdown key={folder.id} title={folder.title} id={folder.id} iconId={folder.iconId} listType='folder'/>
        ))}
      </Accordion>

  </>
  )
}

export default FolderDropdownList