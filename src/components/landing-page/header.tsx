'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Logo from '../../../public/taskifyLogo.svg';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { HomeIcon, InfoIcon, MenuIcon, ShoppingCart, UsersIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { ThemeToggler } from '../global/ThemeToggler';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';



const Header = () => {
  const {user} = useSupabaseUser()
  const [path, setPath] = useState('#home');
  return (
  
      <header className='flex justify-between items-center h-16 px-4 lg:px-6'>
        <Link href={"/"} className='flex gap-2 items-center justify-center'>
          <Image src={Logo} alt='Taskify logo' width={25} height={25} />
          <span className='text-2xl font-semibold'>taskify.</span>
        </Link>
          <NavigationMenu className='hidden lg:flex'>
            <NavigationMenuList className='flex gap-5'>
              <NavigationMenuItem>
                <NavigationMenuLink onClick={e=>setPath("#home")} className={cn(navigationMenuTriggerStyle(),{
                    'text-xl':true,
                    'font-normal':true,
                    "dark:bg-transparent":true,
                    "dark:text-white": path=== "#home",
                    "dark:text-white/40" : path!=="#home",
                    "cursor-pointer":true,
                  
                })} >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                onClick={e=>setPath("#pricing")}
                  className={cn({
                    "text-xl":true,
                    "dark:bg-transparent":true,
                  "dark:text-white": path=== "#pricing",
                  "dark:text-white/40" : path!=="#pricing",
                  "cursor-pointer":true,
                  "font-normal":true
                  })}
                >
                  Pricing
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                onClick={e=>setPath("#testimonials")}
                  className={cn(navigationMenuTriggerStyle(),{
                    "text-xl":true,
                    "dark:bg-transparent":true,
                  "dark:text-white": path=== "#testimonials",
                  "dark:text-white/40" : path!=="#testimonials",
                  "cursor-pointer":true,
                  "font-normal":true
                  })}
                >
                  Testimonials
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                onClick={e=>setPath("#about")}
                  className={cn({
                    "text-xl":true,
                    "dark:bg-transparent":true,
                  "dark:text-white": path=== "#about",
                  "dark:text-white/40" : path!=="#about",
                  "cursor-pointer":true,
                  "font-normal":true
                  })}
                >
                  About
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {user?(
<div className="hidden lg:flex  gap-4">
          <ThemeToggler/>
            <Button variant="outline" className='text-xl  font-normal'>
              <Link href={"/signup"}>Sign Up</Link>
            </Button>
            <Button className='text-xl font-normal'>
              <Link href={"/login"}>
              Login
              </Link>
              </Button>
          </div>
          ):""}
          
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} size={"icon"} className='lg:hidden'>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <div className='grid gap-2'>
                <Link className='flex gap-3 mb-5 items-center' href={"/"}>
                  <Image src={Logo} alt='taskify logo'/>
                  <span className='text-2xl font-semibold'>taskify.</span>
                </Link>
                <nav className='grid ml-6 gap-4'>
                  <Link href={"#"} onClick={e=>setPath("#home")} className={cn({
                    "flex":true,
                    "text-lg":true,
                    " gap-2":true,
                    "dark:text-white": path=== "#home",
                    "dark:text-white/40" : path!=="#home",
                    "cursor-pointer":true,
                    "font-normal":true
                  })}>
                    <HomeIcon/>
                    <span>Home</span>
                  </Link>
                  <Link href={"#"} onClick={e=>setPath("#pricing")} className={cn({
                    "flex":true,
                    "text-lg":true,
                    " gap-2":true,
                    "dark:text-white": path=== "#pricing",
                    "dark:text-white/40" : path!=="#pricing",
                    "cursor-pointer":true,
                    "font-normal":true
                  })}>
                    <ShoppingCart/>
                    <span>Pricing</span>
                  </Link>
                  <Link href={"#"} onClick={e=>setPath("#testimonials")} className={cn({
                    "flex":true,
                    "text-lg":true,
                    " gap-2":true,
                    "dark:text-white": path=== "#testimonials",
                    "dark:text-white/40" : path!=="#testimonials",
                    "cursor-pointer":true,
                    "font-normal":true
                  })}>
                    <UsersIcon/>
                    <span>Testimonials</span>
                  </Link>
                  <Link href={"#"} onClick={e=>setPath("#about")} className={cn({
                    "flex":true,
                    "text-lg":true,
                    " gap-2":true,
                    "dark:text-white": path=== "#about",
                    "dark:text-white/40" : path!=="#about",
                    "cursor-pointer":true,
                    "font-normal":true
                  })}>
                    <InfoIcon/>
                    <span>About</span>
                  </Link>
                </nav>
    
                  <div className='flex flex-col gap-2 mt-2'>
                    <Button className='text-xl font-normal' variant={"outline"}>
                      <Link href={"/signup"}>SignUp</Link>
                    </Button>
                    <Button className='font-normal text-xl'>
                      <Link  href={"/login"}>Login</Link>
                    </Button>
                  </div>
  
            </div>
          </SheetContent>
        </Sheet>
      </header>
  );
};

export default Header;

// const ListItem = React.forwardRef<
//   React.ElementRef<'a'>,
//   React.ComponentPropsWithoutRef<'a'>
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             'group block select-none space-y-1 font-medium leading-none'
//           )}
//           {...props}
//         >
//           <div className="text-white text-sm font-medium leading-none">
//             {title}
//           </div>
//           <p
//             className="group-hover:text-white/70
//             line-clamp-2
//             text-sm
//             leading-snug
//             text-white/40
//           "
//           >
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });

// ListItem.displayName = 'ListItem';