import { NextRequest, NextResponse } from "next/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "../../../../firebase-admin";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import { getUsersFromSearch } from "@/lib/supabase/queries";


export async function POST(req:NextRequest) {
    const supabase = createServerComponentClient({cookies})
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return
    const User = await getUsersFromSearch(user?.email??"")
    if (!User) return
    const {room } = await req.json()
    const session = liveblocks.prepareSession(User[0].email!,{
        userInfo:{
            name: User[0]?.fullName!,
            email:User[0]?.email!,
            avatar:User[0]?.avatarUrl!

        }
    });
    const usersInRoom = await adminDb.collectionGroup("rooms").where("userId","==",User[0]?.email).get()
    const userInRoom = usersInRoom.docs.find((doc)=> doc.id === room)
    if (userInRoom?.exists){
        session.allow(room,session.FULL_ACCESS)
        const {body,status} = await session.authorize()
        return new Response(body,{status})
    }else{
        return NextResponse.json({
            message:'You are not in the room'
            
        },{
            status:403
        })
    }
}