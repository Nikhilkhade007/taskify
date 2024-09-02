import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect } from 'react';
import { useAppState } from '../providers/state-provider';

import { File, Folder } from '../supabase/supabase.types';
import { useRouter } from 'next/navigation';

const useSupabaseRealtime = () => {
  const supabase = createClientComponentClient();
  const { dispatch, state, workspaceId: selectedWorskpace } = useAppState();
  const router = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'files' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            console.log('🟢 RECEIVED REAL TIME EVENT');
            const {
              folder_id: folderId,
              workspace_id: workspaceId,
              id: fileId,
            } = payload.new;
            if (
              !state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((folder) => folder.id === folderId)
                ?.files.find((file) => file.id === fileId)
            ) {
              const newFile: File = {
                id: payload.new.id,
                workspaceId: payload.new.workspace_id,
                folderId: payload.new.folder_id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTash: payload.new.in_tash,
                bannerUrl: payload.new.banner_url,
              };
              dispatch({
                type: 'ADD_FILE',
                payload: { file: newFile, folderId, workspaceId },
              });
            }
          } else if (payload.eventType === 'DELETE') {
            let workspaceId = '';
            let folderId = '';
            const fileExists = state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>
                folder.files.some((file) => {
                  if (file.id === payload.old.id) {
                    workspaceId = workspace.id;
                    folderId = folder.id;
                    return true;
                  }
                })
              )
            );
            if (fileExists && workspaceId && folderId) {
              router.replace(`/dashboard/${workspaceId}`);
              dispatch({
                type: 'DELETE_FILE',
                payload: { fileId: payload.old.id, folderId, workspaceId },
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const { folder_id: folderId, workspace_id: workspaceId } =
              payload.new;
            state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>
                folder.files.some((file) => {
                  if (file.id === payload.new.id) {
                    dispatch({
                      type: 'UPDATE_FILE_DATA',
                      payload: {
                        workspaceId,
                        folderId,
                        fileId: payload.new.id,
                        file: {
                          bannerUrl:payload.new.banner_url,
                          title: payload.new.title,
                          iconId: payload.new.icon_id,
                          inTash: payload.new.in_tash,
                        },
                      },
                    });
                    return true;
                  }
                })
              )
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {event:"*",schema:"public",table:"folders"},
        async(payload)=>{
          if (payload.eventType === 'INSERT'){
            const {
              workspace_id: workspaceId,
              id: fileId,
            } = payload.new;

            if (!state.workspaces.find((workspace)=>workspace.id === workspaceId)?.folders.find((folder)=>folder.id)===fileId){
              const newFolder:Folder={
                id: payload.new.id,
                workspaceId: payload.new.workspace_id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTash: payload.new.in_tash,
                bannerUrl: payload.new.banner_url,
              }
              dispatch({
                type:"ADD_FOLDER",
                payload:{
                  workspaceId,folder:{...newFolder,files:[]}
                }
              })
            }
          }else if (payload.eventType === "DELETE"){
            let workspaceId = '';
            const folderExist = state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>{
                if (folder.id === payload.old.id){
                  workspaceId = workspace.id
                  return true
                }}
              )
            );
            if (folderExist && workspaceId ) {
              router.replace(`/dashboard/${workspaceId}`);
              dispatch({
                type: 'DELETE_FOLDER',
                payload:{folderId:payload.old.id},
              });
            }
          }else if (payload.eventType === "UPDATE"){
            const {  workspace_id: workspaceId } =
              payload.new;
              state.workspaces.some((workspace)=>{
                workspace.folders.some((folder)=>{
                  if (folder.id === payload.new.id){
                    dispatch({
                      type:"UPDATE_FOLDER_DATA",
                      payload:{
                        workspaceId,folderId:payload.new.id,folder:{
                          bannerUrl:payload.new.banner_url,
                          title:payload.new.title,
                          iconId:payload.new.icon_id,
                          inTash: payload.new.in_tash
                        }
                      }
                    })
                    return true
                  }
                })
              })
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, state, selectedWorskpace]);

  return null;
};

export default useSupabaseRealtime;