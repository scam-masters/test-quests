"use client";
import React from 'react';
import logo from '../../../public/assets/logo-transparent.svg';
import Button from '../../components/button/button';
import Image from 'next/image';

/**
 * Renders the 404 Not Found page.
 * 
 * @param {Function} switchPage - A function to switch to another page.
 * @returns {JSX.Element} The rendered 404 Not Found page.
 */
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
