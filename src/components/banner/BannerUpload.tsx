import { appFoldersType, appWorkspacesType } from '@/lib/providers/state-provider'
import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger';
import BannerUploadForm from './BannerUploadForm';

                    {/* <BannerUpload details={details} id={fileId} dirType={dirType} className="mt-2 text-sm text-muted-foreground p-2 hover:text-card-foreground rounded-md">
                    </BannerUpload> */}
interface BannerUploadProps{
    details:appFoldersType|appWorkspacesType|workspace|Folder|File;
    id:string;
    dirType:"folder"|"file"|"workspace";
    className?:string;
    children:React.ReactNode;
}
function BannerUpload({id,children,className,dirType,details}:BannerUploadProps) {
  return (
    <CustomDialogTrigger className={className} content={<BannerUploadForm dirDetails={details} dirType={dirType} id={id}/>} header='Upload Banner'>
        {children}
    </CustomDialogTrigger>
  )
}

export default BannerUpload