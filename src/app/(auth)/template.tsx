import React, { ReactNode } from 'react'

function template({children}:{children:ReactNode}) {
  return (
    <div className='flex h-full p-6 justify-center items-center'>
        {children}
    </div>
  )
}

export default template