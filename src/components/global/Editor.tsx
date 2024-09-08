'use client'
import { useRoom, useSelf } from '@liveblocks/react/suspense'
import React, { useEffect, useState } from 'react'
import * as Y from "yjs"
import {LiveblocksYjsProvider} from "@liveblocks/yjs"
import {BlockNoteView} from "@blocknote/shadcn"
import {BlockNoteEditor } from "@blocknote/core"

import "@blocknote/core/fonts/inter.css"
import '@blocknote/shadcn/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import stringToColor from '@/lib/stringToColor'
type BlockNoteProps= {
    workspace: Y.Doc ;
    provider:any
}
function BlockNote ({workspace,provider}:BlockNoteProps){
    const userInfo = useSelf((me)=>me.info)
    const editor:BlockNoteEditor = useCreateBlockNote({
        collaboration:{
            provider,
            fragment:workspace?.getXmlFragment("workspace-store"),
            user:{
                name: userInfo.name ? userInfo.name : userInfo.email  ,
                color:stringToColor(userInfo?.email)
            }
        }
    })
    return(
        <BlockNoteView editor={editor} className="min-h-screen"/>
    )
}
function Editor() {
    const room = useRoom()
    const [workspace,setWorkspace] = useState<Y.Doc>()
    const [provider,setProvider] = useState<LiveblocksYjsProvider>()
    useEffect(()=>{
        const yDoc = new Y.Doc()
        const yProvider = new LiveblocksYjsProvider(room,yDoc)
        setWorkspace(yDoc)
        setProvider(yProvider)
    },[room])
    if (!room || !provider) {
        return null
    }
    if (!workspace) return
  return (
    <div className='max-w-[900px] mx-auto relative'>
        
        <BlockNote workspace={workspace} provider={provider}/>
    </div>
  )
}

export default Editor