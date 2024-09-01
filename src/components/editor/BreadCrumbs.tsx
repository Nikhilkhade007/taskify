'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { useAppState } from '@/lib/providers/state-provider'
  
function BreadCrumbs() {
    const router = useRouter()
    const {state,workspaceId} = useAppState()
    const appBreadCrumbs = useMemo(()=>{
        const pathname = usePathname()
    if (!pathname) return
    const segments = pathname.split("/").filter((val)=>val !== "dashboard" && val)
    const workspaceDetails = state.workspaces.find((workspace)=>workspace.id === workspaceId)
    const workspaceBreadCrumbs = workspaceDetails ?(
        <BreadcrumbItem>
            <BreadcrumbLink className='hover:cursor-pointer' onClick={()=>router.replace(`/dashboard/${workspaceId}`)}>{`${workspaceDetails.iconId} ${workspaceDetails.title}`}</BreadcrumbLink>
        </BreadcrumbItem>
    ):"";
    if (segments.length == 1){
        return workspaceBreadCrumbs
    }
    const folderSegment = segments[1]
    const folderDetails = workspaceDetails?.folders.find((folder)=>folder.id === folderSegment);
    const folderBreadCrumbs = folderDetails ?(
        <>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
            <BreadcrumbLink className='hover:cursor-pointer' onClick={()=>router.replace(`/dashboard/${workspaceId}/${folderSegment}`)}>{`${folderDetails.iconId} ${folderDetails.title}`}</BreadcrumbLink>
            </BreadcrumbItem>
        </>
    ):""
    if (segments.length ==2){
        return (
            <>
                {workspaceBreadCrumbs}
                {folderBreadCrumbs}
            </>
        )
    }
    const fileSegment = segments[2]
    const fileDetails = folderDetails?.files.find((files)=>files.id === fileSegment);
    const fileBreadCrumbs = fileDetails ?(
        <>
          <BreadcrumbSeparator/>
           <BreadcrumbItem>
           <BreadcrumbLink className='hover:cursor-pointer' onClick={()=>router.replace(`/dashboard/${workspaceId}/${folderSegment}/${fileSegment}`)}>{`${fileDetails.iconId} ${fileDetails.title}`}</BreadcrumbLink>
           </BreadcrumbItem>
       </>
   ):""
    if (segments.length === 3){
        
        return (
            <> 
                {workspaceBreadCrumbs}
                {folderBreadCrumbs}
                {fileBreadCrumbs}
            </>
        )
    }
    },[state])
    
    
  return (
    <Breadcrumb>
        <BreadcrumbList>
            {appBreadCrumbs}
        </BreadcrumbList>
    </Breadcrumb>

  )
}

export default BreadCrumbs