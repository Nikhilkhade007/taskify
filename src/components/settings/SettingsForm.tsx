'use client';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useToast } from '../ui/use-toast';
import { useAppState } from '@/lib/providers/state-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Briefcase,
  CreditCard,
  ExternalLink,
  ExternalLinkIcon,
  Lock,
  LogOut,
  Plus,
  Share,
  User as UserIcon,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  addCollaborators,
  deleteWorkspace,
  getCollaborators,
  getIdsByWorkspace,
  getUserById,
  getUsersFromSearch,
  removeCollaborators,
  updateUser,
  updateWorkspace,
} from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import Link from 'next/link';
import { postData } from '@/lib/utils';
import SearchCollaborator from '../global/searchCollaborator';
import LogoutButton from '../global/LogoutButton';
import clsx from 'clsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AvatarUploadTypes } from '@/lib/types';
import { z } from 'zod';
import { useSubscriptionModal } from '@/lib/providers/subscription-model-provider';
import { addCollaboratorsInFirebase, deleteWorkspacesInFirebase, removeCollaboratorsFromFB } from '@/lib/server-action/action';

const SettingsForm = () => {
  const { toast } = useToast();
  const { user, subscription } = useSupabaseUser();
  const {open,setOpen} = useSubscriptionModal()
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { state, workspaceId, dispatch } = useAppState();
  const [permissions, setPermissions] = useState('private');
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace>();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const isOwner = workspaceDetails?.workspaceOwner == user?.id
  const [avatar_url,setAvatarUrl] = useState("")
  const [isDeleting,startDeleting] = useTransition()

  const redirectToCustomerPortal = async () => {
    setLoadingPortal(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      });
      window.location.assign(url);
    } catch (error) {
      console.log(error);
      setLoadingPortal(false);
    }
    setLoadingPortal(false);
  };
  
  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;
    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
    const allRooms = await getIdsByWorkspace(workspaceId)
    await addCollaboratorsInFirebase(allRooms!,profile.email!)
    router.refresh()
  };

  //remove collaborators
  const removeCollaborator = async (user: User) => {
    if (!workspaceId) return;
    if (collaborators.length === 1) {
      setPermissions('private');
    }
    await removeCollaboratorsFromFB(workspaceId,[user.email!])
    await removeCollaborators([user], workspaceId);
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.id !== user.id)
    );
    router.refresh();
  };

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;
    dispatch({
      type: 'UPDATE_WORKSPACE_DATA',
      payload: { workspace: { title: e.target.value }, workspaceId },
    });
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await updateWorkspace({ title: e.target.value }, workspaceId);
      router.refresh()
    }, 500);
  };

  const onChangeWorkspaceLogo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!workspaceId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const uuid = v4();
    setUploadingLogo(true);
    await supabase.storage.from("workspace-logos").remove([workspaceDetails?.logo!])
    const { data, error } = await supabase.storage
      .from('workspace-logos')
      .upload(`workspaceLogo.${uuid}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!error) {
      dispatch({
        type: 'UPDATE_WORKSPACE_DATA',
        payload: { workspace: { logo: data.path }, workspaceId },
      });
      await updateWorkspace({ logo: data.path }, workspaceId);
      setUploadingLogo(false);
      router.refresh()
    }
  };

  const onClickAlertConfirm = async () => {
    if (!workspaceId) return;
    if (collaborators.length > 0) {
      const collaboratorsEmail = collaborators.map(c=>c.email || "" )
      await removeCollaboratorsFromFB(workspaceId,collaboratorsEmail!)
      await removeCollaborators(collaborators, workspaceId);
    }
    setPermissions('private');
    setOpenAlertMessage(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState:{isSubmitting:isAvtarUploading,errors}
} = useForm<z.infer<typeof AvatarUploadTypes>>({
    mode:"onChange",
    defaultValues: {profilePicture:""}
})
const uploadAvtarPicture: SubmitHandler<
    z.infer<typeof AvatarUploadTypes>
  > = async (values) => {
    const file = values.profilePicture?.[0];
    if (!file) return
    const avatarid = v4()
    try{
      if (avatar_url){
        await supabase.storage.from("avatars").remove([avatar_url])
      }
      const {data,error} = await supabase.storage.from("avatars").upload(`avatar-${avatarid}`,file,{ cacheControl: '5', upsert: true })
        if (error) throw new Error();
        const updateInfo = await updateUser(user?.id!,data.path)
        if (updateInfo?.error) return
        console.log("Path in console",data.path)
        setAvatarUrl(data.path)
        router.refresh()
    }catch(e){
      console.log(e)
      return
    }
  }
  const onPermissionsChange = (val: string) => {
    if (val === 'private') {
      setOpenAlertMessage(true);
    } else setPermissions(val);
  };

  const WorkspaceDelete = ()=>{
    startDeleting(async()=>{
      if (!isOwner) return
    if (!workspaceId)return
    const allRooms = await getIdsByWorkspace(workspaceId)
    await deleteWorkspacesInFirebase(allRooms!)
    dispatch({
      type:"DELETE_WORKSPACE",
      payload: workspaceId
    })
    await deleteWorkspace(workspaceId)
    router.refresh()
    router.push("/dashboard")
    })
  }

  useEffect(() => {
    const showingWorkspace = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    if (showingWorkspace) setWorkspaceDetails(showingWorkspace);

  }, [workspaceId, state.workspaces]);

  useEffect(() => {
    if (!workspaceId) return;
    const fetchCollaborators = async () => {
      const response = await getCollaborators(workspaceId);
      if (response.length) {
        setPermissions('shared');
        setCollaborators(response);
      }
    };
    fetchCollaborators();
  }, [workspaceId,state]);

  useEffect(()=>{
    const getAvatarData = async()=>{
      const data= await getUsersFromSearch(user?.email!)
      console.log(data[0])
      setAvatarUrl(data[0]?.avatarUrl!)
      
    }
    
    getAvatarData()
    
  },[avatar_url])
  return (
    <ScrollArea className='h-[400px]'>
    <div className="flex gap-4 m-2 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="workspaceName"
          className="text-sm text-muted-foreground"
        >
          Name
        </Label>
        <Input
          name="workspaceName"
          value={workspaceDetails ? workspaceDetails.title : ''}
          placeholder="Workspace Name"
          onChange={workspaceNameChange}
        />
        <Label
          htmlFor="workspaceLogo"
          className="text-sm text-muted-foreground"
        >
          Workspace Logo
        </Label>
        <Input
          name="workspaceLogo"
          type="file"
          accept="image/*"
          placeholder="Workspace Logo"
          onChange={onChangeWorkspaceLogo}
          disabled={uploadingLogo || subscription?.status !== "active"}
        />
        {subscription?.status !== 'active' && (
          <small className="text-muted-foreground">
            To customize your workspace, you need to be on a Pro Plan
          </small>
        )}
      </div>
      <>
        <Label htmlFor="permissions">Permissions</Label>
        <Select
          onValueChange={onPermissionsChange}
          value={permissions}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div
                  className="p-2
                  flex
                  gap-4
                  justify-center
                  items-center
                "
                >
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share/>
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {permissions === 'shared' && (
          <div>
            <SearchCollaborator
              existingCollaborator={collaborators}
              getCollborator={(user) => {
                addCollaborator(user);
              }}
            >
              <Button
                type="button"
                className="text-sm mt-4"
              >
                <Plus />
                Add Collaborators
              </Button>
            </SearchCollaborator>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators {collaborators.length || ''}
              </span>
              <ScrollArea
                className="
            h-[120px]
            overflow-y-scroll
            w-full
            rounded-md
            border
            border-muted-foreground/20"
              >
                {collaborators.length ? (
                  collaborators.map((c) => (
                    <div
                      className="p-4 flex
                      justify-between
                      items-center
                "
                      key={c.id}
                    >
                      <div className="flex gap-4 items-center">
                        <Avatar>
                          <AvatarImage src="/avatars/7.png" />
                          <AvatarFallback>PJ</AvatarFallback>
                        </Avatar>
                        <div
                          className="text-sm 
                          gap-2
                          text-muted-foreground
                          overflow-hidden
                          overflow-ellipsis
                          sm:w-[300px]
                          w-[140px]
                        "
                        >
                          {c.email}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => removeCollaborator(c)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div
                    className="absolute
                  right-0 left-0
                  top-0
                  bottom-0
                  flex
                  justify-center
                  items-center
                "
                  >
                    <span className="text-muted-foreground text-sm">
                      You have no collaborators
                    </span>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
        <Alert className={clsx("",{
          "hidden":!isOwner
        })} variant={'destructive'}>
          <AlertDescription>
            Warning! deleting you workspace will permanantly delete all data
            related to this workspace.
          </AlertDescription>
          <Button
          disabled={!isOwner||isDeleting}
            type="submit"
            size={'sm'}
            variant={'destructive'}
            className="mt-4 
            text-sm
            bg-destructive/40 
            border-2 
            border-destructive"
            onClick={WorkspaceDelete}
          >
            {isDeleting?"Deleting....":"Delete workspace"}
          </Button>
        </Alert>
        <p className='flex items-center gap-2 mt-6'>
          <UserIcon/>Profile
        </p>
        <Separator/>
        <div className='flex-col flex justify-center gap-2'>
          <div className='flex items-center'>
          <Avatar>
            <AvatarImage  src={supabase.storage.from("avatars").getPublicUrl(avatar_url).data.publicUrl}/>
            <AvatarFallback>{user?.email?.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col ml-6'>
            <span className='text-muted-foreground cursor-not-allowed'>
              {user?.email}
            </span>
          </div>
          </div>
            <Label htmlFor='profilePicture' className='text-sm text-muted-foreground'>
                Profile Picture
            </Label>
            <form className='flex gap-2' onSubmit={handleSubmit(uploadAvtarPicture)}>
              <div>
              <Input id='profilePicture' type='file' accept='image/*' placeholder='Profile picture' disabled={isAvtarUploading} {...register("profilePicture",{required:"Banner Image is required!"})}/>
              <small className='text-red-500'>
                {errors.profilePicture?.message?.toString()}
              </small>
              </div>
              <Button disabled={isAvtarUploading} type='submit'>
                {isAvtarUploading?"Uploading....":"Upload"}
              </Button>
            </form> 
        </div>
        <div className='flex items-center'>
          <span>LogOut</span>
          <LogoutButton>
          <div className='flex items-center justify-center '>
            <LogOut/>
          </div>
        </LogoutButton>
        </div>
        <p className='flex items-center gap-2 mt-6 '>
            <CreditCard size={20}/>
            <span>Billing and Plan</span>
        </p>
        <Separator/>
        <p className='text-muted-foreground'>
          You are currently on a{" "}
          {subscription?.status === "active" ? "Pro " :"Free "}
          Plan
        </p>
        <Link href={"/"} target='_blank' className='text-muted-foreground flex flex-row items-center gap-2'>
        View Plan <ExternalLinkIcon size={20}/></Link>
        {
          subscription?.status === "active" ?(
            <div>
            <Button
              type="button"
              size="sm"
              variant={'secondary'}
              disabled={loadingPortal}
              className="text-sm"
              onClick={redirectToCustomerPortal}
            >
              Manage Subscription
            </Button>
          </div>
          ):(
            <div>
              <Button type='button' size={"sm"} variant={"secondary"} className='sm' onClick={()=>setOpen(true)}>
                Start Plan
              </Button>
            </div>
          )
        }
      </>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDescription>
              Changing a Shared workspace to a Private workspace will remove all
              collaborators permanantly.
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertMessage(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onClickAlertConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </ScrollArea>
  );
};

export default SettingsForm;


