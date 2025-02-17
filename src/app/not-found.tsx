import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='not-found space-y-8'>
      <h2>¡Oops! 😅 Parece que te has perdido...</h2>
      <p>
        Esta página está fuera de servicio o nunca existió (¡ups, nuestro
        error!). Pero no te preocupes, sigue explorando
      </p>
      <Link href='/' className='btn is-secondary'>
        Volver al inicio
      </Link>
    </div>
  )
}
