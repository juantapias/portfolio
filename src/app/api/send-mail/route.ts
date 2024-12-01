import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject,
      text: message,
    })

    return NextResponse.json(
      { success: true, message: 'Correo enviado con éxito.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al enviar el correo:', error)

    return NextResponse.json(
      { success: false, error: 'Hubo un problema al enviar el correo.' },
      { status: 500 }
    )
  }
}
