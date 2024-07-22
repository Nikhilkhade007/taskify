import { StickyNoteIcon } from 'lucide-react'
import React from 'react'
interface featureCardProps{
    title: string,
    description: string,
    children: React.ReactNode
}
function FeaturesCard({title,description,children}:featureCardProps) {
  return (
    <div className='space-y-2'>
            {children}
            <h3 className='text-xl font-bold'>{title}</h3>
            <p className=' text-muted-foreground text-washed-purple-700'>{description}</p>
          </div>
  )
}

export default FeaturesCard