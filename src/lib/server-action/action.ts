'use server'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { adminDb } from "../../../firebase-admin";
import { cookies } from 'next/headers';
import { getUsersFromSearch } from "../supabase/queries";
import liveblocks from "../liveblocks";

export async function createWorkSpaceInFirebase(uuid:string) {
    const supabase = createServerComponentClient({cookies})
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return
    const User = await getUsersFromSearch(user?.email??"")
    const workspaceRef = adminDb.collection("workspaces").doc(uuid);
    const workRef = await workspaceRef.set({
        title:"new Workspace",
        createdAt: new Date(),
    })
    await adminDb
    .collection('users')
    .doc(User[0]?.email!)
    .collection("rooms")
    .doc(uuid)
    .set({
        userId: User[0]?.email,
        role:"owner",
        createdAt: new Date(),
        roomId: uuid
    })
    return {workspaceId : uuid}
}


export const deleteWorkspacesInFirebase = async (roomIds: string[]) => {
    console.log(roomIds);
    try {
      const batch = adminDb.batch();
  
      for (const roomId of roomIds) {
        batch.delete(adminDb.collection("workspaces").doc(roomId));
        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get();
        
        query.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
  
        try {
          await liveblocks.deleteRoom(roomId);
        } catch (err:any) {
          if (err.response?.status === 404) {
            console.warn(`Room ${roomId} not found in Liveblocks, skipping Liveblocks deletion...`);
          } else {
            console.error(`Error deleting room ${roomId} from Liveblocks:`, err);
          }
        }
      }
        await batch.commit();
      return { success: true };
    } catch (error) {
      console.error("Error deleting workspaces and rooms:", error);
      return { success: false };
    }
  };
  

  export const addCollaboratorsInFirebase = async (roomIds: string[], email: string) => {
    try {
      const batch = adminDb.batch(); 
  
      roomIds.forEach((roomId) => {
        const roomRef = adminDb.collection("users").doc(email).collection("rooms").doc(roomId);
        batch.set(roomRef, {
          userId: email,
          role: "editor",
          createdAt: new Date(),
          roomId,
        });
      });
  
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  export const addMultipleCollaborators = async (roomId: string, emails: string[]) => {
    try {
      const batch = adminDb.batch(); 
      for (const email of emails) {
        const collaboratorRef = adminDb.collection("users").doc(email).collection("rooms").doc(roomId);
        batch.set(collaboratorRef, {
          userId: email,
          role: "editor",
          createdAt: new Date(),
          roomId,
        });
      }
      await batch.commit();
  
      return { success: true };
    } catch (err) {
      console.error("Error adding collaborators:", err);
      return { success: false };
    }
  };
  
  export const removeCollaboratorsFromFB = async (roomId: string, emails: string[]) => {
    try {
      const batch = adminDb.batch(); // Create a batch to perform multiple operations
      emails.forEach((email) => {
        const roomRef = adminDb.collection("users").doc(email).collection("rooms").doc(roomId);
        batch.delete(roomRef);
      });
  
      await batch.commit(); // Commit the batch of deletions
  
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  };
  