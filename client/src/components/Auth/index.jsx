import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { FaPlaneDeparture } from "react-icons/fa";
const Auth = () => {
  const [type, setType] = useState("login");
  
  return (
    <div className='w-[100vw] bg-purple-50 flex justify-center'>
      <div className='w-full max-w-[1400px]  p-2 font-sans sm:p-6 lg:p-20 h-[100vh] flex flex-col justify-center '>
        <div className='w-full md:hidden text-blue-700 text-4xl font-serif font-bold p-3 flex justify-center text-center'>
          <h2 className='flex gap-3 '>
            Altitude Air <FaPlaneDeparture className='animate-pulse' />
          </h2>
        </div>
        <div className='w-full flex  flex-col md:flex-row bg-white border border-gray-300 rounded-md overflow-hidden'>
          <div className='w-full lg:w-1/2 hidden md:block lg:h-full relative '>
            <img
              src='https://media.istockphoto.com/id/155439315/photo/passenger-airplane-flying-above-clouds-during-sunset.webp?s=2048x2048&w=is&k=20&c=vTEooaffdqLJKxR9syBtR9lrsCx3P67GEgrS2LcAI2w='
              alt=''
              className='pl-5 pb-5  h-full'
            />
            <div className=' absolute gap-2 bg-black opacity-80 text-white flex text-center flex-col items-center justify-center py-10 px-5 mr-5 z-30 bottom-0 '>
              <h1 className='text-4xl lg:text-5xl font-serif'> Altitude Air</h1>
              <hr className='p-[2px] rounded w-[40%] bg-white' />
              <p className='text-sm p-2 font-sans text-gray-300'>
                We promise to ensure that your well-being is taken care of while
                traveling with us. Boasting top in class fleet inventory and a 5
                star approval for our in-flight experience.you know you`ur
                getting the best from Altitude with no attitude.
              </p>
            </div>
          </div>

          <div className='w-full lg:w-1/2 flex flex-col justify-center  p-5 sm:p-10'>
            {type === "signup" ? (
              <Signup setType={setType} />
            ) : (
              <Login setType={setType} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
