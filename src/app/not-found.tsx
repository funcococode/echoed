'use client'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function NotFound() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    let intervalId;

    if (count > 0) {
      intervalId = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    }else{
      redirect('/')
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [count]);

  return (
    <div className='h-screen grid place-content-center text-4xl'>
      <h1>You've reached somewhere unknown!</h1>
      <p className='text-base mt-4'>Taking you back to Home in {count} seconds</p>
    </div>
  )
}
