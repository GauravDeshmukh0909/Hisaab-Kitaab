import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function Notfound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='gradient-title text-6xl font-bold '>404</h1>
        <p className='text-xl text-gray-600 mt-4'>Page Not Found</p>
        <p className='text-gray-500 mt-2'>The page you are looking for does not exist.</p>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-blue-600 text-blue-600 hover:bg-blue-50 mt-6"
        >
          <Link href="/">
            Go to Home
          </Link>
        </Button>   
        <p className='text-gray-400 mt-2'>© 2023 HisabKitab</p>
        <p className='text-gray-400'>Made with ❤️ by Gaurav</p>
    
    </div>
  )
}

export default Notfound