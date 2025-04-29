'use client'

import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import compressAndConvert from '@/app/lib/compressAndConvert'

export default function EditBlogForm() {
    const { blogId } = useParams()
    const { data: session, status } = useSession()
    const router = useRouter()

    const { register, handleSubmit, control, reset, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            category: '',
            sections: [{ heading: '', content: '', image: null }]
        }
    })
    const { fields, append, remove } = useFieldArray({ control, name: "sections" })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [previews, setPreviews] = useState({})

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blogs/${blogId}`)
                if (!res.ok) throw new Error()
                const data = await res.json()

                reset({
                    title: data.title,
                    category: data.category,
                    sections: data.sections.map(sec => ({
                        heading: sec.heading,
                        content: sec.content,
                        image: sec.image || null,
                    }))
                })

                const previewImages = {}
                data.sections.forEach((sec, idx) => {
                    if (sec.image) previewImages[idx] = sec.image
                })
                setPreviews(previewImages)

            } catch (error) {
                console.error(error)
                setErrorMsg('Failed to load blog data.')
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [blogId, reset])

    const onSubmit = async (data) => {
        setSaving(true);

        try {
            const updatedSections = await Promise.all(
                data.sections.map(async section => {
                    if (section.image instanceof File) {
                        const base64 = await compressAndConvert(section.image, {
                            maxWidth: 800,
                            maxHeight: 800,
                            quality: 0.7
                        });
                        return { heading: section.heading, content: section.content, image: base64 };
                    }
                    return section;
                })
            );

            const payload = {
                blogId: blogId,  // ✨ Add this line
                title: data.title,
                category: data.category,
                sections: updatedSections,
                author: session?.user?.id || '',
                authorName: session?.user?.fullName || '',
            };

            await axios.put(`/api/blogs/edit-blog/`, payload);

            setSuccessMsg('Blog updated successfully!');
            setTimeout(() => {
                router.push(`/blogs/${blogId}`);
            }, 1500);

        } catch (error) {
            console.error('Update failed:', error);
            setErrorMsg('Failed to update the blog. Try again.');
        } finally {
            setSaving(false);
            setTimeout(() => {
                setSuccessMsg('');
                setErrorMsg('');
            }, 5000);
        }
    }


    if (loading || status === 'loading') return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="loader"></div>
        </div>
    )
    if (!session) return null

    return (
        <div className='bg-[url(/hero-bg.jpg)] bg-cover bg-no-repeat py-9'>
            <div className="flex flex-col items-center backdrop-blur-sm gap-10 mx-auto px-16 py-9 bg-white/50 w-fit rounded-xl">
                <h2 className="font-black text-3xl text-[#333333]">Edit Blog</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[600px]">

                    {saving && (
                        <div className="fixed inset-0 z-50 flex justify-center items-center">
                            <div className="loader"></div>
                        </div>
                    )}

                    {/* Blog Title */}
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Enter Blog Title"
                            {...register("title", { required: "Title is required" })}
                            className="border border-gray-600 outline-none rounded-md h-12 px-6 text-sm"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Blog Category */}
                    <div className="flex flex-col gap-2">
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="border border-gray-600 outline-none rounded-md h-12 px-6 text-sm"
                            defaultValue=""
                        >
                            <option value="" disabled>Select a Category</option>
                            <option value="food">Food</option>
                            <option value="fashion">Fashion</option>
                            <option value="travel">Travel</option>
                            <option value="health-and-wellness">Health & Wellness</option>
                            <option value="beauty">Beauty</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>

                    {/* Blog Sections */}
                    <div className="flex flex-col gap-6 max-h-96 overflow-auto scrollbar-hide">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border border-gray-300 p-4 rounded-md bg-white/40">
                                <div className='flex items-center justify-between mb-2'>
                                    <h2 className='font-semibold'>Section {index + 1}</h2>
                                    <button type="button" onClick={() => remove(index)} className="cursor-pointer">
                                        <Image src={`/delete.svg`} alt="delete" width={25} height={25} />
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Section Heading"
                                        {...register(`sections.${index}.heading`, { required: "Heading is required" })}
                                        className="border border-gray-600 outline-none rounded-md h-10 px-4 text-sm"
                                    />
                                    {errors.sections?.[index]?.heading && (
                                        <p className="text-red-500 text-sm">{errors.sections[index].heading.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 mb-2">
                                    <textarea
                                        placeholder="Section Content"
                                        {...register(`sections.${index}.content`, { required: "Content is required" })}
                                        className="border border-gray-600 outline-none rounded-md px-4 py-2 text-sm"
                                        rows={4}
                                    />
                                    {errors.sections?.[index]?.content && (
                                        <p className="text-red-500 text-sm">{errors.sections[index].content.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 mb-2">
                                    {previews[index] ? (
                                        <div className="relative w-full">
                                            <Image
                                                src={previews[index]}
                                                alt="Preview"
                                                width={500}
                                                height={300}
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviews(prev => ({ ...prev, [index]: null }));

                                                    const updatedSections = [...getValues("sections")];
                                                    updatedSections[index].image = null;
                                                    setValue("sections", updatedSections);
                                                }}
                                                className="absolute top-0 right-0 text-sm px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                                            >
                                                <Image src={`/close.svg`} alt="close" width={20} height={20} />
                                            </button>

                                        </div>
                                    ) : (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setPreviews(prev => ({ ...prev, [index]: URL.createObjectURL(file) }))
                                                    const updatedSections = [...getValues("sections")]
                                                    updatedSections[index].image = file
                                                    setValue("sections", updatedSections)
                                                }
                                            }}
                                            className="border border-gray-600 outline-none rounded-md px-4 py-2 text-sm"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => append({ heading: '', content: '', image: null })}
                            className="text-sm font-semibold cursor-pointer text-dark-purple hover:underline"
                        >
                            + Add Section
                        </button>
                    </div>

                    {successMsg && <p className="text-green-800 text-sm text-center">{successMsg}</p>}
                    {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

                    <button
                        type="submit"
                        className="w-full bg-dark-purple hover:bg-dark-purple/90 transition-all cursor-pointer text-white py-2 rounded-md text-lg font-semibold"
                    >
                        {saving ? 'Saving...' : 'Update Blog'}
                    </button>

                </form>
            </div>
        </div>
    )
}
