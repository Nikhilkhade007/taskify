import React from 'react'
interface TitleSectionProps{
    title:String,
    subheading?:String,
    pill:String
}

function TitleSection({title,subheading,pill}:TitleSectionProps) {
  return (
    <>
        <section className='flex flex-col items-start gap-4 justify-center md:items-center'>
            <article className='flex items-center justify-center text-sm p-[1.5px] rounded-full bg-gradient-to-r from-brand-primaryBlue to-brand-primaryPurple'>
                <div className='px-3 py-1 rounded-full dark:bg-black'>
                {pill}
                </div>
            </article>
            {subheading ? 
            (<>
                <h2 className='text-3xl sm:text-5xl sm:max-w-[750px] md:text-center font-semibold'>
                    {title}
                </h2>
                <p className='md:text-center dark:text-washed-purple-700 sm:max-w-[450px]'>
                    {subheading}
                </p>
            </>
            )
            :(
                <h1 className='text-4xl text-left md:text-center md:max-w-[850px] sm:text-6xl font-semibold '>
                    {title}
                </h1>
            )}
        </section>
    </>
  )
}

export default TitleSection