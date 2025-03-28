import React from 'react'

/**
 * Applicable on all route of organizational folder
 */

const AuthLayout =({children}:{children:React.ReactNode})=> {
  return (
    <div className='h-full flex items-center justify-center' >
        {children}
    </div>
       
    )
}

export default AuthLayout;
