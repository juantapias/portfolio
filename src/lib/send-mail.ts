import nodemailer from 'nodemailer'

export async function sendMail({
  to,
  // name,
  subject,
  body,
}: {
  to: string
  name: string
  subject: string
  body: string
}) {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  })

  try {
    const response = await transport.verify()
    console.log(response)
  } catch (e) {
    console.error(e)
    return
  }

  try {
    const sendResult = await transport.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      html: body,
    })

    console.log(sendResult)
  } catch (e) {
    console.error(e)
  }
}
