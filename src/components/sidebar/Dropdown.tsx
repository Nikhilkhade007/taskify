'use client'
import { useAppState } from '@/lib/providers/state-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/emoji-picker';
import { updateFile, updateFolder } from '@/lib/supabase/queries';
import { toast } from '../ui/use-toast';
import TooltipComponent from '../global/tooltip-component';
import { Plus } from 'lucide-react';
interface DropdownProps{
  title:string;
  id:string;
  listType: "folder" | "file";
  iconId:string;
  children?: React.ReactNode;
  disabled?: boolean;
}
const Dropdown = ({title,id,iconId,children,disabled,listType}:DropdownProps) =>{
  const supabase = createClientComponentClient();
  const {state,workspaceId,dispatch,folderId} = useAppState();
  const [isEditing,setIsEditing] = useState(false);
  const router = useRouter()
  const isFolder = listType === 'folder'
  const pathname = usePathname()
  //styles
  const groupStyle = clsx(
    'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
    {
      'group/folder':isFolder,
      'group/file':!isFolder
    }
  )
  //functions
  function handleDoubleClicke(){
    setIsEditing(true)
  }
  async function handleBlur(){
    setIsEditing(false)
    const fid = id.split("folder")
    if (fid?.length === 1){
      if (!folderTitle) return 
      await updateFolder({title:folderTitle},fid[0])
      toast({
        title:"success",
        description:`Folder title change to ${folderTitle}`
      })
    }
    if (fid.length === 2 && fid[1]){
      if (!fileTitle) return
      await updateFile({title:fileTitle},fid[1])
      toast({
        title:"success",
        description:`File title change to ${fileTitle}`
      })
    }
  }
  const navigateToPage = (accordianId:string,type:string)=>{
    if (type == "folder"){
      router.push(`/dashboard/${workspaceId}/${accordianId}`)
    }
    if (type == "file"){
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordianId}`)
    }
  }

  const addFile = ()=>{

  }
  //onChange
  const folderTitleChange = (e:any)=>{
    if (!workspaceId) return
    const fid = id.split("folder")
    if (fid.length === 1){
      dispatch({
        type:"UPDATE_FOLDER_DATA",
        payload:{
          workspaceId,folderId:fid[0],folder:{title: e.target.value}
        }
      })
    }
  }

  const fileTitleChange = (e:any)=>{
    if (!workspaceId) return 
    const fid = id.split('folder')
    if (fid.length === 2 && fid[1]){
      dispatch({
        type:"UPDATE_FILE_DATA",
        payload:{
          workspaceId,folderId:fid[0],fileId:fid[1],file:{title:e.target.value}
        }
      })
    }
  }
  const onEmojiChange = async(selectedEmoji:string)=>{
    if (!workspaceId) return
    if (listType === 'folder'){
      
      const {data,error} = await updateFolder({iconId:selectedEmoji},id)
      if (error){
        toast({
          title:"Error!!!",
          variant:"destructive",
          description:"Failed to upadte the emoji"
        })
      }else{
        dispatch({
          type:"UPDATE_FOLDER_DATA",
          payload:{
            workspaceId,
            folderId:id,
            folder: {iconId:selectedEmoji}
          }
        })
        toast({
          title:"Success",
          description:"Emoji changed successfully"
        })
      }
    }
  }
  //useMemo
  const folderTitle:string | undefined = useMemo(()=>{
    if (listType === "folder"){
      const stateTitle = state.workspaces.find(workspace=> workspace.id === workspaceId)?.folders.find(folder=> folder.id === id)?.title
      if (title === stateTitle || !stateTitle) return title
      return stateTitle
    }
  },[state,listType,workspaceId,id,title])
  
  const fileTitle:string|undefined = useMemo(()=>{
    if (listType === "file"){
      const fileAndFolderId = id.split('folder')
      const stateTitle = state.workspaces.find(workspace=>workspace.id === workspaceId)?.folders.find(folder=>folder.id === fileAndFolderId[0])?.files.find(file=>file.id === fileAndFolderId[1])?.title
      if (title === stateTitle || !stateTitle) return title
      return stateTitle
    }
  },[state,workspaceId,listType,id,title])
  const listStyles = useMemo(()=>{
    return clsx('relative',{
      'border-none text-md': isFolder,
      "border-none ml-6 text-[16px] py-1": !isFolder
    })
  },[])
  return (
    <AccordionItem value={id} onClick={e=>{
      e.stopPropagation()
      navigateToPage(id,listStyles)
    }} className={listStyles}>
      <AccordionTrigger id={listType} className='p-2 hover:no-underline dark:text-muted-foreground text-sm' disabled={listType === "file"}>
        <div className={groupStyle}>
          <div className='flex gap-4 items-center  justify-center overflow-hidden'>
            <div className='relative'>
              <EmojiPicker getValue={onEmojiChange}>{iconId}</EmojiPicker>
            </div>
            <input type='text' value={listType === "folder" ?folderTitle:fileTitle} className={clsx('outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',{
              'bg-muted cursor-text':isEditing,
              "bg-transparent cursor-pointer":!isEditing
            })} readOnly={!isEditing} onDoubleClick={handleDoubleClicke}
            onBlur={handleBlur} onChange={listType === "folder" ? folderTitleChange :fileTitleChange}/>
          </div>
          <div className='h-full hidden group-hover/file:block rounded-sm absolute right-0 items-center gap-2 justify-center'>
          {listType === 'folder' && !isEditing && (
            <TooltipComponent message='Add file'>
              <Plus size={14} onClick={addFile} className='hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors'/>
            </TooltipComponent>
          )}
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown
