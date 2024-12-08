import { linkTree } from '@/data/link-tree'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug

  try {
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'El parámetro "slug" es requerido',
        },
        { status: 400 }
      )
    }

    const user = linkTree.find(item => item.userName === slug)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener los datos',
      },
      { status: 500 }
    )
  }
}
