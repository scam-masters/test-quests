import React from 'react';
import logo from '../assets/logo-transparent.svg';
import Button from '../components/button/button';
import Image from 'next/image';

function Error404(switchPage) {
  return (
    <div className='bg-tq-white dark:bg-tq-black h-screen w-screen flex flex-col justify-center items-center'>
      <div className='flex-grow flex flex-col justify-center items-center'>
        <Image src={logo} alt="Logo" className="h-24" />
        <h1 className='text-4xl font-bold text-tq-primary mt-4'>404 Not Found</h1>
        <Button onClick={() => switchPage('landing')} type='blue'>
            Go back to main page
        </Button>
      </div>
    </div>
  );
}

export default Error404;
