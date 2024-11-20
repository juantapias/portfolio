export default function Contact() {
  const letsTalk = ['H', 'A', 'B', 'L', 'A', 'M', 'O', 'S', '?']
  return (
    <>
      <div className='let-talk p-8'>
        <div className='container mx-auto space-y-8'>
          <div className='text-center flex items-center justify-center space-x-4'>
            {letsTalk.map((letter, key) => (
              <div key={key} className='orbit-letter'>
                <span className='letter'>{letter}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='contact'>
          <div className='container mx-auto px-8'>
            <div className='container mx-auto px-8'>
              <div className='form-group'>
                <input type='text' id='name' className='form-input' required />
                <label htmlFor='name' className='form-label'>
                  Nombre:
                </label>
              </div>

              <div className='form-group'>
                <input type='mail' id='mail' className='form-input' required />
                <label htmlFor='mail' className='form-label'>
                  E-mail:
                </label>
              </div>

              <div className='form-group'>
                <input
                  type='text'
                  id='subject'
                  className='form-input'
                  required
                />
                <label htmlFor='subject' className='form-label'>
                  Asunto:
                </label>
              </div>

              <div className='form-group'>
                <textarea id='message' className='form-text-area' required />
                <label htmlFor='message' className='form-label'>
                  Mensaje:
                </label>
              </div>

              <div className='form-submit'>
                <button type='submit'>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
