'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'


function Login() {
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='bg-[url(/hero-bg.jpg)] bg-cover py-9'>
            <div className="flex flex-col items-center backdrop-blur-sm gap-9 mx-auto px-16  py-9  bg-white/50 w-fit rounded-xl ">
                <div className="flex flex-col gap-4 items-center">
                    <h2 className="font-black text-3xl text-[#333333]">
                        Login to Blog Hub
                    </h2>
                    <p className="text-gray-500 text-center">
                        Welcome back! Please enter your credentials to access your blogging journey. <br />
                        Need help? Contact support or reset your password.
                    </p>
                </div>
                <form
                    className="relative z-10  flex flex-col  gap-6 "
                    onSubmit={handleSubmit((data) => { console.log(data) })}
                >
                    <div className="flex flex-col gap-6">
                        <input
                            type="text"
                            placeholder="Enter your Email ID "
                            {...register("emailId", { required: true })} // Field Name Fixed
                            className="border border-gray-600 outline-none rounded-md h-12 px-6 w-full text-sm"
                        />
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                {...register("password", { required: true })}
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
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-dark-purple hover:bg-dark-purple/90 transition-all cursor-pointer text-white py-2 rounded-md text-lg font-semibold"
                    >
                        Login
                    </button>
                </form>
                <div className='flex flex-col gap-2 items-center'>
                    <span className="  cursor-pointer hover:underline text-gray-600 font-medium text-sm ">
                        Forgot Password?
                    </span>
                    <p className="text-center text-gray-500">
                        New to Blog Hub?{" "}
                        <Link href="/auth/signup">
                            <span className="text-gray-500 hover:underline cursor-pointer font-semibold">Sign Up Now</span>
                        </Link>

                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
