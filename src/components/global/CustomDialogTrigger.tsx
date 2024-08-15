import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import clsx from 'clsx'

interface CustomDialogTriggerProps{
    children: React.ReactNode,
    className?:string,
    content?:React.ReactNode,
    header?: string,
    description?:string
}
function CustomDialogTrigger({content,children,className,header,description}:CustomDialogTriggerProps) {
  return (
    <Dialog>
        <DialogTrigger className={clsx("",className)}>{children}</DialogTrigger>
        <DialogContent>
            <DialogTitle>
                {header}
            </DialogTitle>
            <DialogDescription>
                {description}
            </DialogDescription>
            {content}
        </DialogContent>
    </Dialog>
  )
}

export default CustomDialogTrigger