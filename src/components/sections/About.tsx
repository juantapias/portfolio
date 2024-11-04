import React from 'react'

export default function About() {
  return (
    <div className='container mx-auto'>
      <div className='grid grid-rows-1'>
        <div className='grid grid-cols-3 gap-8'>
          <div className='bg-secondary rounded-2xl text-white p-4'>about</div>
          <div className='bg-secondary rounded-2xl text-white p-4'>tools</div>
          <div className='bg-secondary rounded-2xl text-white p-4'>exp</div>
        </div>
      </div>
    </div>
  )
}
