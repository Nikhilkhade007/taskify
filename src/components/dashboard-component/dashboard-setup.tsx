'use client'
import { Subscription, workspace } from '@/lib/supabase/supabase.types';
import { AuthUser } from '@supabase/supabase-js';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import EmojiPicker from '../global/emoji-picker';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { CreateWorkspaceFormSchema } from '@/lib/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4  } from 'uuid';
import { Button } from '../ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '../ui/use-toast';
import { createWorkspace } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/state-provider';
import { useRouter } from 'next/navigation';
import { createWorkSpaceInFirebase } from '@/lib/server-action/action';
interface DashboardSetupProps {
    user: AuthUser;
    subscription: Subscription | null;
  }
function DashboardSetup({user,subscription}:DashboardSetupProps) {
  const router = useRouter()
  const { dispatch } = useAppState();
  const supabase = createClientComponentClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: 'onChange',
    defaultValues: {
      logo: '',
      workspaceName: '',
    },
  });
  const [selectedEmoji, setSelectedEmoji] =useState('🎉');
  const onSubmit: SubmitHandler<
  z.infer<typeof CreateWorkspaceFormSchema>
> = async (value) => {
  console.log(value)
  const file = value.logo?.[0];
  let filePath = null;
  const workspaceUUID = v4();
  console.log(file);
  if (file) {
    try {
      const { data, error } = await supabase.storage
        .from('workspace-logos')
        .upload(`workspaceLogo.${workspaceUUID}`, file, {
          cacheControl: '3600',
          upsert: true,
        });
      if (error) throw new Error('');
      filePath = data.path;
    } catch (error) {
      console.log('Error', error);
      toast({
        variant: 'destructive',
        title: 'Error! Could not upload your workspace logo',
      });
      
    }
  }
  try {
   
    const newWorkspace: workspace = {
      data: null,
      createdAt: new Date().toISOString(),
      iconId: selectedEmoji,
      id: workspaceUUID,
      inTash: '',
      title: value.workspaceName,
      workspaceOwner: user.id,
      logo: filePath || null,
      bannerUrl: '',
    };
    const { data, error: createError } = await createWorkspace(newWorkspace);
    if (createError) {
      throw new Error();
    }
    dispatch({
      type: 'ADD_WORKSPACE',
      payload: { ...newWorkspace, folders: [] },
    });
    console.log("Calling toast")
    toast({
      title: 'Workspace Created',
      description: `${newWorkspace.title} has been created successfully.`,
    });
    router.replace(`/dashboard/${newWorkspace.id}`);
    await createWorkSpaceInFirebase(newWorkspace.id)
  } catch (error) {
    console.log(error, 'Error');
    toast({
      variant: 'destructive',
      title: 'Could not create your workspace',
      description:
        "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
    });
  } finally {
    reset();
  }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create workspace</CardTitle>
        <CardDescription>
          Create a new workspace to organize tasks and collaborate with team members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <div className='text-5xl'>
                <EmojiPicker getValue={emoji=> setSelectedEmoji(emoji)}>{selectedEmoji}</EmojiPicker>
              </div>
              <div className='w-full space-y-2'>
              <Label
                  htmlFor="workspaceName"
                  className="text-sm
                  text-muted-foreground
                "
                >
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register('workspaceName', {
                    required: 'Workspace name is required',
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <Label
                htmlFor="logo"
                className="text-sm
                  text-muted-foreground
                "
              >
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Name"
                disabled={isLoading}
                  {...register('logo', {
                    required: 'Workspace logo is required',
                  })}
              />
              <small className="text-red-600">
                {errors?.logo?.message?.toString()}
              </small>
              {/* {subscription?.status !== 'active' && (
                <small
                  className="
                  text-muted-foreground
                  block
              "
                >
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )} */}
          </div>
          <div className='flex justify-end'>
          <Button type="submit" disabled={isLoading}>
            {isLoading?"Creating....":"Create workspace"}
          </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    )
}

export default DashboardSetup