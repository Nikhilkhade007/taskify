'use client';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { Lock, Plus, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { v4 } from 'uuid';
import { addCollaborators, createWorkspace } from '@/lib/supabase/queries';
import SearchCollaborator from './searchCollaborator';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../ui/use-toast';
import { useAppState } from '@/lib/providers/state-provider';
import { addCollaboratorsInFirebase, addMultipleCollaborators, createWorkSpaceInFirebase } from '@/lib/server-action/action';

const CreateWorkspace = () => {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState('private');
  const [title, setTitle] = useState('');
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collaboratorsEmail,setCollaboratorsEmail] = useState<any>()
  const {dispatch,workspaceId} = useAppState()
  const addCollaborator = async(user: User) => {
    setCollaborators([...collaborators, user]);
    setCollaboratorsEmail([...collaboratorsEmail,user.email])
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
    setCollaboratorsEmail(collaboratorsEmail((e:string)=>e !== user.email))
  };

  const createItem = async () => {
    setIsLoading(true);
    const uuid = v4();
    if (user?.id) {
      const newWorkspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: '💼',
        id: uuid,
        inTash: '',
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: '',
        folders:[]
      };
      await addMultipleCollaborators(newWorkspace.id,collaboratorsEmail)
      if (permissions === 'private') {
        toast({ title: 'Success', description: 'Created the workspace' });
      dispatch({
        type:"ADD_WORKSPACE",
        payload: newWorkspace
      })
        await createWorkspace(newWorkspace);
        await createWorkSpaceInFirebase(newWorkspace.id)
        router.refresh()
        router.push(`/dashboard/${newWorkspace.id}`);
      }
      if (permissions === 'shared') {
        toast({ title: 'Success', description: 'Created the workspace' });
        dispatch({
          type:"ADD_WORKSPACE",
          payload: newWorkspace
        })
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, uuid);
        await createWorkSpaceInFirebase(newWorkspace.id)
        router.refresh()
        router.push(`/dashboard/${newWorkspace.id}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label
          htmlFor="name"
          className="text-sm text-muted-foreground"
        >
          Name
        </Label>
        <div
          className="flex 
        justify-center 
        items-center 
        gap-2
        "
        >
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <>
        <Label
          htmlFor="permissions"
          className="text-sm
          text-muted-foreground"
        >
          Permission
        </Label>
        <Select
          onValueChange={(val) => {
            setPermissions(val);
          }}
          defaultValue={permissions}
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
                  <Share></Share>
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
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
      <Button
        type="button"
        disabled={
          !title ||
          (permissions === 'shared' && collaborators.length === 0) ||
          isLoading
        }
        variant={'secondary'}
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  );
};

export default CreateWorkspace;