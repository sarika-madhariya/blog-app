'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import { GlobalContext } from '@/app/lib/GlobalContext'

function Login() {
    const { data: session, status } = useSession()

    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const { setGlobalLoading } = useContext(GlobalContext)

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const router = useRouter();

    const onSubmit = async (data) => {
        setGlobalLoading(true); // Set loading state to true
        try {
            setServerErrorMsg(""); // clear previous errors

            const result = await signIn("credentials", {
                redirect: false,
                emailId: data.emailId,
                password: data.password,
                callbackUrl
            });

            if (!result.error) {
                router.push(result.url || callbackUrl)
            } else {
                console.error("Login failed:", result.error);
                setServerErrorMsg(result.error); // show error to user
            }
        } catch (err) {
            console.error("Unexpected error during sign in:", err);
            setServerErrorMsg("Something went wrong. Please try again later.");
        } finally {
            setGlobalLoading(false); // Set loading state to false

        }
    };
    useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl)
        }
    }, [status, router, callbackUrl])

    if (status === 'loading') return (<div className='fixed inset-0 flex items-center justify-center'><div className='loader'></div></div>)

    if (session) return null
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
                    onSubmit={handleSubmit(onSubmit)}
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

                    {serverErrorMsg && (<p className="text-red-500 text-sm mt-2">{serverErrorMsg}</p>)}
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
