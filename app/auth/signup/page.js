'use client'
import React, { useContext, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '@/app/lib/GlobalContext';

function SignUp() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setGlobalLoading } = useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrorMsg, setServerErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  // Protect signup route: redirect if already logged in

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'loading') return;  // wait for session
    if (session) {
      router.push('/');
    }
  }, [session, status, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    setGlobalLoading(true);
    setServerErrorMsg("");
    try {
      const response = await axios.post("/api/auth/register", data);
      // Upon successful registration, redirect to home
      router.push('/');
      reset();
    } catch (error) {
      if (error.response?.status === 409) {
        setServerErrorMsg("Email is already registered. Please use a different email.");
      } else {
        setServerErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
      }
      setTimeout(() => setServerErrorMsg(''), 5000);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        <div className='loader'></div>
      </div>
    );
  }
  if (session) return null
  return (
    <div className='bg-[url(/hero-bg.jpg)] bg-cover bg-no-repeat py-9'>
      <div className="flex flex-col items-center backdrop-blur-sm gap-10 mx-auto px-16 py-9 bg-white/50 w-fit rounded-xl">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="font-black text-3xl text-[#333333]">Signup for Blog Hub Account</h2>
          <p className="text-gray-500 text-center">
            Sign up to access our blog post portal.<br /> Fill in your details and get started with seamless blogging and content management.
          </p>
        </div>
        <form className="relative z-10 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {loading && (
            <div className='inset-0 fixed z-50 flex justify-center items-center'>
              <div className='loader'></div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className='flex gap-2'>
              <div className='flex flex-col gap-2 w-full'>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  {...register("firstName", { required: "First Name is required" })}
                  className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  {...register("lastName", { required: "Last Name is required" })}
                  className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <input
                type="email"
                placeholder="Enter your Email ID"
                {...register("emailId", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" }
                })}
                className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
              />
              {serverErrorMsg && <p className="text-red-500 text-sm text-center">{serverErrorMsg}</p>}
              {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId.message}</p>}
            </div>
            <div className='flex flex-col gap-2 relative'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
                className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm pr-10"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => {
                  setShowPassword(!showPassword);
                  setTimeout(() => setShowPassword(false), 1000);
                }}
              >
                <Image src={showPassword ? 'hide-password.svg' : 'show-password.svg'} alt="toggle" width={24} height={24} />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: value => value === password || "Passwords do not match"
                })}
                className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
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
          Already registered?{' '}
          <Link href={`/auth/login?callbackUrl=${encodeURIComponent(router.pathname + window.location.search)}`}>
            <span className="font-semibold hover:underline cursor-pointer">Login</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
