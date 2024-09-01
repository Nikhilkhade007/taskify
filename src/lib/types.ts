import { Socket, Server as NetServer } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { z } from "zod";

export const FormSchema = z.object({
    email:z.string().describe("Email").email({message: "Invalid email"}),
    password: z.string().describe("Password").min(6,"Password must be at least 6 characters")
})
export const CreateWorkspaceFormSchema = z.object({
    workspaceName: z.string().describe('Workspace Name').min(1, 'Workspace name must be min of 1 character'),
    logo: z.any(),
  });

  export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };