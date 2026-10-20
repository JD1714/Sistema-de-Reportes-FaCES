import React from 'react'

export default function Link({ href, children, className, onClick, ...props }: any) {
  return (
    <a
      href={href || '#'}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
