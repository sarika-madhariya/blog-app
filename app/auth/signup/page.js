'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function SignUp() {
  const {
    register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  return (
    <div className='bg-[url(/hero-bg.jpg)] bg-cover bg-no-repeat py-9'>
      <div className="flex flex-col items-center backdrop-blur-sm gap-10 mx-auto px-16  py-9  bg-white/50 w-fit rounded-xl ">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-black text-3xl text-[#333333]">
            Signup for Blog Hub Account
          </h2>
          <p className="text-gray-500 text-center">
            Sign up to access our blog post portal.<br /> Fill in your details and get started with seamless blogging and content management.
          </p>
        </div>
        <form
          className="relative z-10  flex flex-col  gap-6"
          onSubmit={handleSubmit((data) => { console.log(data) })}
        >
          <div className="flex flex-col gap-5">
            <div className='flex gap-2'>
              <div className='flex flex-col gap-2'>
                <input
                  type="text"
                  placeholder="Enter your First Name "
                  {...register("firstName", { required: "First Name is required" })} // Field Name 
                  className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div className='flex flex-col gap-2'>
                <input
                  type="text"
                  placeholder="Enter your Last Name "
                  {...register("lastName", { required: "Last Name is required" })} // Field Name 
                  className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <input
                type="email"
                placeholder="Enter your Email ID "
                {...register("emailId", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
                })} // Field Name Fixed
                className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
              />
              {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId.message}</p>}

            </div>
            <div className='flex flex-col gap-2'>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
                  className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => {
                    setShowPassword(!showPassword)
                    setTimeout(() => {
                      setShowPassword(false)
                    }, 1000)
                  }}
                >
                  {showPassword ? <Image src={`hide-password.svg`} alt="hide-password" width={24} height={24} /> : <Image src={`show-password.svg`} alt="show-password" width={24} height={24} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm pr-10"
              />

              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

            </div>
          </div>


          <button
            type="submit"
            className="w-full bg-dark-purple hover:bg-dark-purple/90 transition-all cursor-pointer text-white py-2 rounded-md text-lg font-semibold px-6"
          >
            Create Your Blog Hub Account
          </button>
        </form>
        <p className="text-center text-gray-500">
          Already registered? <Link href="/auth/login"><span className="font-medium hover:underline cursor-pointer">Login</span></Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
