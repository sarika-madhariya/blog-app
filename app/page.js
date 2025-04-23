'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Home() {

  const homeSections = [
    {
      heading: "Food and Recipes",
      para: "Cooking made easy, food made delicious. Discover the recipes that make every meal memorable!",
      img: "food1.jpg",
      link: 'food'
    },
    {
      heading: "Discover Your Next Adventure",
      para: "Dream destinations, wallet-friendly tips — because you don’t need millions to see the world",
      img: "travel.jpg",
      link: 'travel'
    },
    {
      heading: "Health & Wellness",
      para: "Your go-to for mindful living, wellness tips, and healthy habits — because feeling good is the best look!",
      img: "health and wellness.jpg",
      link: 'health-and-wellness'
    },
    {
      heading: "Beauty",
      para: "Bold beauty, real talk, and glam vibes only. Your daily dose of glow, gloss, and goddess energy!",
      img: "beauty.png",
      link: 'beauty'
    },
    {
      heading: "Fashion",
      para: "Style inspo, trend alerts, and fierce fits — serving looks from street to chic, one outfit at a time!",
      img: "fashion.jpg",
      link: 'fashion'
    }
  ];

  return (
    <div className='mx-4 flex flex-col gap-12'>
      <section className="h-[80vh] relative  flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black opacity-10" />
        </div>

        {/* Content */}
        <div className='z-10 flex flex-col gap-12 items-center'>
          <h1 className="text-magnolia playfair-display-i text-5xl font-bold " >
            YOUR BLOG YOUR WAY
          </h1>
          <Link href={`/post-blog`}>
            <button className='bg-magnolia hover:scale-105 text-dark-purple transition-all px-10 cursor-pointer py-3 rounded-md font-semibold text-lg shadow-md'>Get Started</button>
          </Link>
        </div>
      </section>

      {homeSections.map((section, index) => (
        <HomeSection
          key={index}
          idx={index}
          heading={section.heading}
          para={section.para}
          img={section.img}
          link={section.link}
        />
      ))}

    </div>
  )
}

export default Home


function HomeSection({ heading, para, img, idx, link }) {
  const [headingHovered, setHeadingHovered] = useState(false)
  return (
    <section className={`flex justify-between  mx-auto gap-32 items-center ${idx % 2 == 0 ? '' : 'flex-row-reverse'}`}>
      <Image src={`/${img}`} alt={`${heading} image`} width={450} height={650} />
      <div className='flex flex-col gap-9 text-dark-brown'>
        <Link href={`/category/${link}`} onMouseEnter={() => setHeadingHovered(true)} onMouseLeave={() => setHeadingHovered(false)} className='flex gap-3 items-end cursor-pointer'>
          <h2 className='text-3xl playfair-display font-medium text-dark-brown '>{heading}</h2>
          <div className={`rounded-full  transition-all ${headingHovered ? 'translate-x-1.5' : ''} `} >
            <Image src={`right-arrow.svg`} alt='arrow' width={30} height={10} />
          </div>
        </Link>
        <p className='max-w-lg cursor-text text-2xl text-dark-brown text-justify'>“{para}”</p>
      </div>
    </section>
  )
}
