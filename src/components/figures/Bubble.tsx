'use client'

import React, { CSSProperties, forwardRef } from 'react'

type IProps = {
  bottom?: number
  height?: string
  left?: number
  right?: number
  top?: number
  width: string
  zIndex?: number
}

const Bubble = forwardRef<HTMLDivElement, IProps>(
  ({ bottom, height, left, right, top, width, zIndex = -1 }: IProps, ref) => {
    const styles: CSSProperties = {
      ...(bottom !== undefined && { bottom: `${bottom}%` }),
      ...(left !== undefined && { left: `${left}%` }),
      ...(right !== undefined && { right: `${right}%` }),
      ...(top !== undefined && { top: `${top}%` }),
      height,
      width,
      zIndex,
    }

    return <div ref={ref} className='bubble' style={styles} />
  }
)

Bubble.displayName = 'Bubble'

export default Bubble
