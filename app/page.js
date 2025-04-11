import React from 'react'
import Image from 'next/image'

function Home() {
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
          <button className='bg-magnolia hover:scale-105 text-dark-purple transition-all px-10 cursor-pointer py-3 rounded-md font-semibold text-lg shadow-md'>Get Started</button>
        </div>
      </section>
      <section className='flex justify-between  mx-auto gap-32 items-center'>
        <Image src={`/food.jpg`} alt='food' width={450} height={650} />
        <div className='flex flex-col gap-12 text-dark-brown'>
          <h2 className='text-4xl playfair-display font-medium text-dark-brown '>Food and Recipes</h2>
          <p className='max-w-lg text-2xl text-dark-brown text-justify'>A delicious journey through recipes, flavors, and food stories from around the world. From comforting home-cooked meals to exotic dishes, this blog is your go-to for inspiration, tips, and a taste of something new every day.</p>
        </div>
      </section>
      <section className='flex justify-between flex-row-reverse  mx-auto gap-32 items-center'>
        <Image src={`/adventure.jpg`} alt='food' width={450} height={650} />
        <div className='flex flex-col gap-12 text-dark-brown'>
          <h2 className='text-4xl playfair-display font-medium text-dark-brown '>Discover Your Next Adventure
          </h2>
          <p className='max-w-lg text-2xl text-dark-brown text-justify'>Adventure awaits around every corner! Whether you&apos;re dreaming of sun-soaked beaches or hidden mountain trails, your next unforgettable journey is just a booking away. Pack your bags and let the fun begin!</p>
        </div>
      </section>


    </div>
  )
}

export default Home
