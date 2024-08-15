'use client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User } from '@/lib/supabase/supabase.types'
import React, { useEffect, useRef, useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { getUsersFromSearch } from '@/lib/supabase/queries';
interface searchCollaboratorProps{
    children: React.ReactNode,
    existingCollaborator: User[] | [];
    getCollborator: (collborator: User)=>void
}
function SearchCollaborator({children,existingCollaborator,getCollborator}:searchCollaboratorProps) {
    const {user} = useSupabaseUser()
    const [searchResult,setSearchResult ] = useState<User[]|[]>([])
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    useEffect(()=>{
        return()=>{
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    },[])
    const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current  = setTimeout(async()=>{
            const res = await getUsersFromSearch(e.target.value)
            setSearchResult(res)
    },1000)
    }
    const addCollaborator = (user:User)=>{
        getCollborator(user)
    }
  return (
    <Sheet>
        <SheetTrigger className='w-full'>
            {children}
        </SheetTrigger>
        <SheetContent className='w-[400px] sm:w-[540px]'>
            <SheetTitle>Search Collaborator</SheetTitle>
            <SheetDescription>
                <p className='text-sm text-muted-foreground'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus adipisci 
                </p>
            </SheetDescription>
            <SheetHeader>
                <div className='flex justify-center items-center gap-2 mt-2'>
                    <Search/>
                    <Input name='name' className='dark:bg-background' placeholder='Email' onChange={onChangeHandler}/>
                </div>
                <ScrollArea className='mt-6 overflow-y-scroll w-full rounded-md'>
                    {searchResult
                    .filter(
                        (result)=>
                        !existingCollaborator.some(
                                (existing)=> existing.id === result.id
                        )
                    )
                    .filter(result=>result.id !== user?.id)
                    .map((user)=>(
                        <div className='p-4 flex justify-between items-center' key={user.id}>
                            <div className='flex gap-4 items-center'>
                                <Avatar className='w-8 h-8'>
                                    <AvatarImage src="/avatars/7.png"/>
                                    <AvatarFallback>CP</AvatarFallback>
                                </Avatar>
                                <div className='text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground'>
                                    {user.email}
                                </div>
                            </div>
                            <Button type='button' variant={"secondary"} onClick={()=>addCollaborator(user)}>Add</Button>
                        </div>
                    ))}
                </ScrollArea>
            </SheetHeader>
        </SheetContent>
    </Sheet>
  )
}

export default SearchCollaborator