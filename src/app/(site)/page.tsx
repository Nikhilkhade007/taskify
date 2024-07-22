import TitleSection from '@/components/landing-page/title-section'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import Logo from "../../../public/taskifyLogo.svg"
import Bannner from "../../../public/appBanner.png"
import { CLIENTS, PRICING_CARDS, PRICING_PLANS, USERS } from '@/lib/constants'
import Cal from "../../../public/Calender.png"
import CheckIcon from "../../../public/check.svg"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { randomUUID } from 'crypto'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import CustomCard from '@/components/landing-page/custom-card'
import Diamond from "../../../public/diamond.svg"
import { CalendarIcon, CombineIcon, DatabaseIcon, ImportIcon, StickyNoteIcon, TimerIcon } from 'lucide-react'
import FeaturesCard from '@/components/landing-page/featureCard'
import Link from 'next/link'
function HomePage() {
  return (
  <>
    <section className='py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-16'>
        <div className='space-y-4'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight'>Unlock your productivity with taskify.</h1>
          <p className='text-washed-purple-700'>taskify is an all-in-one workspace for your notes, tasks, and projects. Streamline your workflow and collaborate with your team.</p>
          <div className='flex flex-col sm:flex-row gap-4 '>
            <Button className='font-normal sm:text-xl' >
              <Link href={"/signup"}>
              <div>Sign Up</div>
              </Link>
            </Button>
            <Button className='text-xl' variant={"outline"}>
              Learn more
            </Button>
          </div>
        </div>
        <div className='w-full'>
        <Image className="mx-auto aspect-video rounded-xl object-cover" src={Bannner} alt='banner Image' width={700} height={500}/>
        
        </div>
      </div>
    </section>
    <section className="relative">
        <div
          className="overflow-hidden
          flex
          after:content['']
          after:dark:from-brand-dark
          after:to-transparent
          after:from-background
          after:bg-gradient-to-l
          after:right-0
          after:bottom-0
          after:top-0
          after:w-20
          after:z-10
          after:absolute

          before:content['']
          before:dark:from-brand-dark
          before:to-transparent
          before:from-background
          before:bg-gradient-to-r
          before:left-0
          before:top-0
          before:bottom-0
          before:w-20
          before:z-10
          before:absolute
        "
        >
          {[...Array(2)].map((arr) => (
            <div
              key={arr}
              className="flex
                flex-nowrap
                animate-slide
          "
            >
              {CLIENTS.map((client) => (
                <div
                  key={client.alt}
                  className=" relative
                    w-[200px]
                    m-20
                    shrink-0
                    flex
                    items-center
                  "
                >
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    width={200}
                    className="object-contain max-w-none"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section
        className="px-4
        sm:px-6
        flex
        justify-center
        items-center
        flex-col
        relative
      "
      >
        <div
          className="w-[30%]
          blur-[120px]
          rounded-full
          h-32
          absolute
          bg-brand-primaryPurple/50
          -z-10
          top-22
        "
        />
        <TitleSection
          title="Features that make you more productive"
          subheading="Taskify provides a range of features to help you stay organized and focused."
          pill="Features"
        />
        <div className='grid gap-8 sm:self-center self-start my-12 sm:grid-cols-2 lg:grid-cols-3'>
          <FeaturesCard title='Notes' description='Create rich, formatted notes with ease.'>
            <StickyNoteIcon className='h-8 w-8 '/>
          </FeaturesCard>
          <FeaturesCard title='Tasks' description='Manage your tasks and projects with kanban boards.'>
            <TimerIcon className='h-8 w-8 '/>
          </FeaturesCard>
          <FeaturesCard title='Collaboration' description='Invite your team and collaborate in real-time.'>
            <CombineIcon className='h-8 w-8 '/>
          </FeaturesCard>
          <FeaturesCard title='Database' description='Organize your information in custom databases.'>
            <DatabaseIcon className='h-8 w-8 '/>
          </FeaturesCard>
          <FeaturesCard title='Calendar' description='View your tasks and events in a calendar view.'>
            <CalendarIcon className='h-8 w-8 '/>
          </FeaturesCard>
          <FeaturesCard title='Integration' description='Connect Notion with your favorite apps and tools.'>
            <ImportIcon className='h-8 w-8 '/>
          </FeaturesCard>
        </div>
      </section>
      <section className="relative">
        <div
          className="w-full
          blur-[120px]
          rounded-full
          h-32
          absolute
          bg-brand-primaryPurple/50
          -z-100
          top-56
        "
        />
        <div
          className="mt-20
          px-4
          sm:px-6 
          flex
          flex-col
          overflow-x-hidden
          overflow-visible
        "
        >
          <TitleSection
            title="Trusted by all"
            subheading="Join thousands of satisfied users who rely on our platform for their 
            personal and professional productivity needs."
            pill="Testimonials"
          />
          {[...Array(2)].map((arr, index) => (
            <div
              key={randomUUID()}
              className={twMerge(
                clsx('mt-10 flex flex-nowrap sm:gap-6 gap-4 self-start', {
                  'flex-row-reverse': index === 1,
                  'animate-[slide_250s_linear_infinite]': true,
                  'animate-[slide_250s_linear_infinite_reverse]': index === 1,
                  'ml-[100vw]': index === 1,
                }),
                'hover:paused'
              )}
            >
              {USERS.map((testimonial, index) => (
                <CustomCard
                  key={testimonial.name}
                  className="w-[500px]
                  rounded-2xl
                  dark:bg-gradient-to-t
                  dark:from-border dark:to-background
                "
                  cardHeader={
                    <div
                      className="flex
                      items-center
                      gap-4
                  "
                    >
                      <Avatar>
                        <AvatarImage src={`/avatars/${index + 1}.png`} />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-foreground">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="dark:text-washed-purple-800">
                          {testimonial.name.toLocaleLowerCase()}
                        </CardDescription>
                      </div>
                    </div>
                  }
                  cardContent={
                    <p className="dark:text-washed-purple-800">
                      {testimonial.message}
                    </p>
                  }
                ></CustomCard>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section
        className="mt-20
        px-4
        sm:px-6
      "
      >
        <TitleSection
          title="The Perfect Plan For You"
          subheading="Experience all the benefits of our platform. Select a plan that suits your needs and take your productivity to new heights."
          pill="Pricing"
        />
        <div
          className="flex 
        flex-col-reverse
        sm:flex-row
        gap-4
        justify-center
        sm:items-stretch
        items-center
        mt-10
        "
        >
          {PRICING_CARDS.map((card) => (
            <CustomCard
              key={card.planType}
              className={clsx(
                'w-[300px] rounded-2xl dark:bg-black/40 background-blur-3xl relative',
                {
                  'border-brand-primaryPurple/70':
                    card.planType === PRICING_PLANS.proplan,
                }
              )}
              cardHeader={
                <CardTitle
                  className="text-2xl
                  font-semibold
              "
                >
                  {card.planType === PRICING_PLANS.proplan && (
                    <>
                      <div
                        className="hidden dark:block w-full blur-[120px] rounded-full h-32
                        absolute
                        bg-brand-primaryPurple/80
                        -z-10
                        top-0
                      "
                      />
                      <Image
                        src={Diamond}
                        alt="Pro Plan Icon"
                        className="absolute top-6 right-6"
                      />
                    </>
                  )}
                  {card.planType}
                </CardTitle>
              }
              cardContent={
                <CardContent className="p-0">
                  <span
                    className="font-normal 
                    text-2xl
                "
                  >
                    ${card.price}
                  </span>
                  {+card.price > 0 ? (
                    <span className="dark:text-washed-purple-800 ml-1">
                      /mo
                    </span>
                  ) : (
                    ''
                  )}
                  <p className="dark:text-washed-purple-800">
                    {card.description}
                  </p>
                  <Button
                    variant="btn-primary"
                    className="whitespace-nowrap w-full mt-4"
                  >
                    {card.planType === PRICING_PLANS.proplan
                      ? 'Go Pro'
                      : 'Get Started'}
                  </Button>
                </CardContent>
              }
              cardFooter={
                <ul
                  className="font-normal
                  flex
                  mb-2
                  flex-col
                  gap-4
                "
                >
                  <small>{card.highlightFeature}</small>
                  {card.freatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex
                      items-center
                      gap-2
                    "
                    >
                      <Image
                        src={CheckIcon}
                        alt="Check Icon"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              }
            />
          ))}
        </div>
      </section>
      {/* <section className='py-12 px-10 mt-12'>
        <div>
          <div className='space-y-2'>
            <div className='flex gap-2 items-center'>
              <Image height={20} width={20} src={Logo} alt='taskify logo' />
              <span className='text-[16px]'>taskify.</span>
            </div>
            <p className='text-sm text-washed-purple-700'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div >
            <div className='text-washed-purple-800'>HI</div>
            <div className='text-washed-purple-800'>HI</div>
            <div className='text-washed-purple-800'>HI</div>
            <div className='text-washed-purple-800'>HI</div>
            <div className='text-washed-purple-800'>HI</div>
            <div className='text-washed-purple-800'>HI</div>
          </div>
        </div>
      </section> */}
  </>
    
    
  )
}

export default HomePage