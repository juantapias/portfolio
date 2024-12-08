'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { IFetchData } from '@/types'
import Bubble from '@/components/figures/Bubble'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params) as { slug: string }

  gsap.registerPlugin(useGSAP)

  const bubbleBigRef = useRef<HTMLDivElement>(null)
  const bubbleSmallRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState<IFetchData>()

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/link-tree/${slug}`)
      if (!response.ok) {
        throw new Error('Error al obtener los datos')
      }
      const result = await response.json()
      setData({ data: result.data })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!data) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, slug])

  useGSAP(() => {
    gsap.to(bubbleBigRef.current, {
      y: -20,
      duration: 12,
      repeat: -1,
      yoyoEase: 'back.out(1.7)',
      rotate: 360,
    })
    gsap.to(bubbleSmallRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyoEase: 'back.out(1.7)',
    })
  })

  return (
    <div className='link-tree'>
      <Bubble ref={bubbleBigRef} top={0} width='50%' left={-40} />
      <Bubble
        ref={bubbleSmallRef}
        bottom={5}
        height='100px'
        width='100px'
        left={5}
      />
      <div className='tree-buttons space-y-4'>
        {data?.data?.social?.map((item, key) => (
          <Link
            key={key}
            href={item.url}
            target='_blank'
            className='space-x-2 btn-secondary-outline'>
            <i className={`icon ${item.icon}`} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
