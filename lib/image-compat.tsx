import React from 'react'

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  priority,
  ...props
}: any) {
  // If src is an object with default or src property (imported asset), resolve it
  const resolvedSrc = typeof src === 'object' && src !== null ? src.src || src.default || '' : src

  return (
    <img
      src={resolvedSrc}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  )
}
