'use client'
import { useAppState } from '@/lib/providers/state-provider';
import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import React, { useCallback, useMemo, useState } from 'react'
import "quill/dist/quill.snow.css"
import { Button } from '../ui/button';
import { deleteFile, deleteFolder, updateFile, updateFolder } from '@/lib/supabase/queries';
import { useRouter } from 'next/navigation';
interface MainEditorProps{
    dirDetails : File | Folder | workspace;
    fileId:string;
    dirType:"workspace" |"folder"| "file"
}
var TOOLBAR_OPTIONS = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
  
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
  
    ['clean'], // remove formatting button
  ];
function MainEditor({dirDetails,dirType,fileId}:MainEditorProps) {
    const [quill,setQuill] = useState<any>(null)
    const {state,workspaceId,folderId,dispatch} = useAppState()
    const router = useRouter()
    //onCLick
    const handleRestore = async()=>{
        if (dirType=== "file"){
            if (!folderId || !workspaceId) return
            dispatch({
                type:"UPDATE_FILE_DATA",
                payload:{
                    workspaceId,folderId,fileId,file:{inTash:""}
                }
            })
            await updateFile({inTash:""},fileId)
            
        }
        if (dirType === "folder"){
            if (!workspaceId) return
            dispatch({
                type:"UPDATE_FOLDER_DATA",
                payload:{
                    workspaceId,folderId:fileId,folder:{inTash:""}
                }
            })
            await updateFolder({inTash:""},fileId)
        }
    }
    
    const handleDelete = async()=>{
        if (dirType === "file"){
            if (!workspaceId || !folderId) return
            dispatch({
                type:"DELETE_FILE",
                payload:{
                    workspaceId,folderId,fileId
                }
            })
            await deleteFile(fileId)
            router.replace(`/dashboard/${workspaceId}/${folderId}`)
        }
        if (dirType === "folder"){
            if (!workspaceId) return
            dispatch({
                type:"DELETE_FOLDER",
                payload:{folderId:fileId}
            })
            await deleteFolder(fileId)
            router.replace(`/dashboard/${workspaceId}`);

        }
    }
    //wrapperRef
    const details = useMemo(() => {
        let selectedDir;
        if (dirType === 'file') {
          selectedDir = state.workspaces
            .find((workspace) => workspace.id === workspaceId)
            ?.folders.find((folder) => folder.id === folderId)
            ?.files.find((file) => file.id === fileId);
        }
        if (dirType === 'folder') {
          selectedDir = state.workspaces
            .find((workspace) => workspace.id === workspaceId)
            ?.folders.find((folder) => folder.id === fileId);
        }
        if (dirType === 'workspace') {
          selectedDir = state.workspaces.find(
            (workspace) => workspace.id === fileId
          );
        }
    
        if (selectedDir) {
          return selectedDir;
        }
    
        return {
          title: dirDetails.title,
          iconId: dirDetails.iconId,
          createdAt: dirDetails.createdAt,
          data: dirDetails.data,
          inTash: dirDetails.inTash,
          bannerUrl: dirDetails.bannerUrl,
        } as workspace | Folder | File;
      }, [state, workspaceId, folderId]);
    const wrapperRef = useCallback(async (wrapper: any) => {
        if (typeof window !== 'undefined') {
          if (wrapper === null) return;
          wrapper.innerHTML = '';
          const editor = document.createElement('div');
          wrapper.append(editor);
          const Quill = (await import('quill')).default;
          const QuillCursors = (await import('quill-cursors')).default;
          Quill.register('modules/cursors', QuillCursors);
          const q = new Quill(editor, {
            theme: 'snow',
            modules: {
              toolbar: TOOLBAR_OPTIONS,
            //   cursors: {
            //     transformOnTextChange: true,
            //   },
            },
          });
          setQuill(q);
        }
      }, []);
  return (
    <>
        <div className='relative'>
            {details.inTash && (
                <article className='py-2 z-40 bg-[#E85757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap'>
                    <div className='flex flex-col md:flex-row justify-center items-center gap-2'>
                        <span className='text-white'>
                            This {dirType} is in the trash
                        </span>
                        <Button size={"sm"} variant={"outline"} className='bg-transparent border-white hover:bg-white hover:text-[#E85757]' onClick={handleRestore}>
                            Restore
                        </Button>
                        <Button size={"sm"} variant={"outline"} className='bg-transparent border-white hover:bg-white hover:text-[#E85757]' onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </article>
            )}
        </div>
        <div className='flex justify-center items-center flex-col mt-2 relative'>
            <div id='container' className='max-w-[800px]' ref={wrapperRef}></div>
        </div>
    </>
  )
}

export default MainEditor