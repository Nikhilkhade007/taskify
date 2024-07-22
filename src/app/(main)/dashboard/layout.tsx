import React from 'react'
interface layoutProps{
    children:React.ReactNode,
    params: any
}
function Layout({children,params}:layoutProps) {
  return (
    <div>
        {children}
    </div>
  )
}

export default Layout