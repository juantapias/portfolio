'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Inputs = {
  name?: string
  subject?: string
  email?: string
  message?: string
}

const fieldLabels: { [key: string]: string } = {
  name: 'Nombre',
  email: 'Correo Electrónico',
  subject: 'Asunto',
  message: 'Mensaje',
}

export default function Contact() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  const containerRef = useRef<HTMLDivElement>(null)
  const letsTalk = ['H', 'A', 'B', 'L', 'A', 'M', 'O', 'S', '?']

  const [inputs, setInputs] = useState<Inputs>({
    name: '',
    subject: '',
    email: '',
    message: '',
  })
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          markers: false,
          start: '40% 50%',
          pin: true,
          end: '+=800',
          scrub: true,
        },
      })

      tl.fromTo(
        '.orbit-letter',
        { y: -300 },
        {
          y: 0,
          duration: 2.5,
          ease: 'bounce.out',
          stagger: 0.2,
        }
      )
      tl.from(['.form-group', '.form-submit'], { opacity: 0, stagger: 0.2 })
    },
    { scope: containerRef }
  )

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!inputs.name || !inputs.email || !inputs.subject || !inputs.message) {
      setError('Por favor, completa todos los campos del formulario.')
      return
    }

    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      })

      if (response.ok) {
        setSuccess(true)
        setInputs({ name: '', subject: '', email: '', message: '' })
        setLoading(false)
      } else {
        setError('Hubo un problema al enviar el mensaje. Intenta nuevamente.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError('Error de red. Intenta más tarde.')
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div id='contact' className='space-y-8' data-bg='light'>
      <div className='let-talk p-10'>
        <div ref={containerRef} className='container mx-auto space-y-8'>
          <div className='text-center flex items-center justify-center space-x-1 md:space-x-4'>
            {letsTalk.map((letter, key) => (
              <div key={key} className='orbit-letter'>
                <span className='letter'>{letter}</span>
              </div>
            ))}
          </div>

          <div className='contact'>
            <div className='container mx-auto px-8'>
              <form onSubmit={onSubmit} className='container mx-auto'>
                {['name', 'email', 'subject', 'message'].map((field, index) => (
                  <div key={index} className='form-group'>
                    {field !== 'message' ? (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        id={field}
                        value={inputs[field as keyof Inputs]}
                        className='form-input'
                        required
                        onChange={e =>
                          handleInputChange(
                            field as keyof Inputs,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <textarea
                        id={field}
                        value={inputs[field as keyof Inputs]}
                        className='form-text-area'
                        required
                        onChange={e =>
                          handleInputChange(
                            field as keyof Inputs,
                            e.target.value
                          )
                        }
                      />
                    )}
                    <label htmlFor={field} className='form-label'>
                      {fieldLabels[field]}:
                    </label>
                  </div>
                ))}

                <div className='form-submit flex flex-col text-center items-center space-y-2'>
                  <button
                    type='submit'
                    className={`${isLoading ? 'is-disabled' : ''}`}
                    disabled={isLoading}>
                    {!isLoading ? (
                      'Enviar'
                    ) : (
                      <i className='icon icon-spinner animate-spin' />
                    )}
                  </button>
                  {error && <p className='error-text'>{error}</p>}
                  {success && (
                    <p className='success-text'>Mensaje enviado con éxito.</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
