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

  useGSAP(() => {
    gsap.from(['.contact-title', '.contact-subtitle'], {
      y: 100,
      opacity: 0,
      stagger: 0.25,
    })
    gsap.from(['.form-group', '.form-submit'], { opacity: 0, stagger: 0.5 })
  })

  const [inputs, setInputs] = useState<Inputs>({
    name: '',
    subject: '',
    email: '',
    message: '',
  })
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

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
    <div id='contact' className='space-y-8 p-8 mt-14' data-bg='light'>
      <div className='let-talk'>
        <div ref={containerRef} className='container mx-auto space-y-8'>
          <div className='text-secondary text-center'>
            <h2 className='font-primary text-3xl md:text-6xl uppercase contact-title'>
              Las ideas cobran vida cuando se comparten
            </h2>
            <span className='font-secondary text-lg md:text-2xl inline-flex contact-subtitle'>
              Hablemos y creemos una experiencia digital única.
            </span>
          </div>

          <div className='contact mx-auto max-w-[40rem]'>
            <div className='container mx-auto px-8'>
              <form onSubmit={onSubmit}>
                {['name', 'email', 'subject', 'message'].map((field, index) => (
                  <div key={index} className='form-group'>
                    <label htmlFor={field} className='form-group-label'>
                      {fieldLabels[field]}:
                    </label>
                    {field !== 'message' ? (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        id={field}
                        value={inputs[field as keyof Inputs]}
                        className='form-group-input'
                        placeholder={`Escribe tu ${fieldLabels[field]}`}
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
                        className='form-group-text-area'
                        placeholder='Escribe tu mensaje'
                        required
                        onChange={e =>
                          handleInputChange(
                            field as keyof Inputs,
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                ))}

                <div className='flex flex-col justify-center text-center items-center space-y-2 form-submit'>
                  <button
                    type='submit'
                    className={`${
                      isLoading ? 'is-disabled' : ''
                    } btn is-secondary`}
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
