'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { IFetchData } from '@/types'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params) as { slug: string }

  gsap.registerPlugin(useGSAP)

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

  return (
    <div className='link-tree'>
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
