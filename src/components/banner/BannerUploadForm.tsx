'use client'
import { appFoldersType, appWorkspacesType, useAppState } from '@/lib/providers/state-provider';
import { File, Folder, workspace } from '@/lib/supabase/supabase.types';
import { BannerUploadTypes } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Loader from '../global/Loader';
import { v4 } from 'uuid';
import { updateFile, updateFolder, updateWorkspace } from '@/lib/supabase/queries';
import { toast } from '../ui/use-toast';
interface BannerUploadFormProps{
    dirType:"folder"|"file"|"workspace",
    id:string;
    dirDetails:appFoldersType|appWorkspacesType|workspace|Folder|File
}
function BannerUploadForm({dirDetails,id,dirType}:BannerUploadFormProps) {
    const supabase = createClientComponentClient()
    const {state,workspaceId,folderId,dispatch} = useAppState()
    const {
        register,
        handleSubmit,
        reset,
        formState:{isSubmitting:isUploading,errors}
    } = useForm<z.infer<typeof BannerUploadTypes>>({
        mode:"onChange",
        defaultValues: {banner:""}
    })
    const onSubmitHandler: SubmitHandler<
    z.infer<typeof BannerUploadTypes>
  > = async (values) => {
    const file = values.banner?.[0];
    if (!file || !id) return;
    try {
      let filePath = null;
    const newId = v4()
      const uploadBanner = async () => {
        if (dirDetails?.bannerUrl){
            await supabase.storage.from("file-banners").remove([dirDetails.bannerUrl])
        }
        const { data, error } = await supabase.storage
          .from('file-banners')
          .upload(`banner-${newId}`, file, { cacheControl: '5', upsert: true });
        if (error) throw new Error();
        filePath = data.path;
      };
      if (dirType === 'file') {
        if (!workspaceId || !folderId) return;
        await uploadBanner();
        dispatch({
          type: 'UPDATE_FILE_DATA',
          payload: {
            file: { bannerUrl: filePath },
            fileId: id,
            folderId,
            workspaceId,
          },
        });
        await updateFile({ bannerUrl: filePath }, id);
      } else if (dirType === 'folder') {
        if (!workspaceId || !folderId) return;
        await uploadBanner();
        dispatch({
          type: 'UPDATE_FOLDER_DATA',
          payload: {
            folderId: id,
            folder: { bannerUrl: filePath },
            workspaceId,
          },
        });
        await updateFolder({ bannerUrl: filePath }, id);
      } else if (dirType === 'workspace') {
        if (!workspaceId) return;
        await uploadBanner();
        dispatch({
          type: 'UPDATE_WORKSPACE_DATA',
          payload: {
            workspace: { bannerUrl: filePath },
            workspaceId,
          },
        });
        await updateWorkspace({ bannerUrl: filePath }, id);
      }
      toast({
        title:"Success",
        description:"Banner uploaded successfully"
      })
    } catch (error) {}
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='flex flex-col gap-2'>
        <Label className='text-sm text-muted-foreground' htmlFor='bannerImage'>
            Banner Image
        </Label>
        <Input type="file" id='bannerImage' accept="image/*" disabled={isUploading} {...register('banner',{required:"Banner Image is required!"})} />
        <small className='text-red-500'>
            {errors.banner?.message?.toString()}
        </small>
        <Button type='submit' disabled={isUploading}>
            {isUploading?<Loader/> :"Upload Banner"}
        </Button>
    </form>
  )
}

export default BannerUploadForm