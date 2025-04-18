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
        <Image src={`/food1.jpg`} alt='food' width={500} height={400} />
        <div className='flex flex-col gap-12 text-dark-brown'>
          <h2 className='text-3xl winky-rough font-medium text-dark-brown '>Food and Recipes</h2>
          <p className='max-w-lg text-2xl text-dark-brown text-justify'>"Cooking made easy, food made delicious. Discover the recipes that make every meal memorable!"</p>
        </div>
      </section>
      <section className='flex justify-between flex-row-reverse  mx-auto gap-32 items-center'>
        <Image src={`/travel.jpg`} alt='food' width={500} height={200} />
        <div className='flex flex-col gap-12 text-dark-brown'>
          <h2 className='text-3xl playfair-display font-medium text-dark-brown '>Discover Your Next Adventure
          </h2>
          <p className='max-w-lg text-2xl text-dark-brown text-justify'>“Dream destinations, wallet-friendly tips — because you don’t need millions to see the world".</p>
        </div>
      </section>
      <section className='flex justify-between  mx-auto gap-32 items-center'>
        <Image src={`/health and wellness.jpg`} alt='Health And Wellness' width={450} height={650} />
        <div className='flex flex-col gap-9 text-dark-brown'>
         <div className='flex flex-col gap-3'> 
          <h2 className='text-3xl playfair-display font-medium text-dark-brown '>Health & Wellness</h2>
          <h3 className='text-2xl playfair-display font-medium text-dark-brown '>“Feel good inside and out.”</h3> 
          </div>
          <p className='max-w-lg cursor-text text-2xl text-dark-brown text-justify'>"Your go-to for mindful living, wellness tips, and healthy habits — because feeling good is the best look!"</p>
        </div>
      </section>
      <section className='flex justify-between flex-row-reverse  mx-auto gap-32 items-center'>
        <Image src={`/beauty.png`} alt='Beauty' width={500} height={600} />
        <div className='flex flex-col gap-12 text-dark-brown'>
          <h2 className='text-3xl playfair-display font-medium text-dark-brown '>Beauty
          </h2>
          <p className='max-w-lg text-2xl text-dark-brown text-justify'>"Bold beauty, real talk, and glam vibes only. Your daily dose of glow, gloss, and goddess energy!"</p>
        </div>
      </section>
      <section className='flex justify-between  mx-auto gap-32 items-center'>
        <Image src={`/fashion.jpg`} alt='Fashion' width={450} height={650} />
        <div className='flex flex-col gap-9 text-dark-brown'>
         <div className='flex flex-col gap-6'> 
          <h2 className='text-3xl playfair-display font-medium text-dark-brown '>Fashion</h2>
          </div>
          <p className='max-w-lg cursor-text text-2xl text-dark-brown text-justify'>"Style inspo, trend alerts, and fierce fits — serving looks from street to chic, one outfit at a time!"</p>
        </div>
      </section>
    </div>
  )
}

export default Home
