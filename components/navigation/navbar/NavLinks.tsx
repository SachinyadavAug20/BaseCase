"use client"
import sidebarLinks from "@/constant"
import { Item } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NavLinks = ({isMobileNav=false,userId}:{isMobileNav?:boolean,userId?:string}) => {
  const pathname=usePathname()
  return (
    <div className="px-1">
    {sidebarLinks.map((link)=>{
      const isActive = (pathname.includes(link.route) && link.route.length>1) || pathname===link.route;
      if(link.route==="/profile"){
        if(userId) link.route=`${link.route}/${userId}`
        else return null;
      }

      const linkComponent=(
        <Link href={link.route} key={link.label} className={`${isActive 
                ? 'primary-gradient rounded-lg text-light-900'
                : 'text-dark300_light900'
              } flex items-center justify-start gap-4 bg-transparent p-4`}>
          <Image src={link.imgURL} alt={link.label} width={20} height={20} className={`${isActive ? "" : "invert-colors"}`}/>
          { !isMobileNav &&
          <p className={`${isActive ? 'base-bold max-lg:hidden' : 'base-medium max-lg:hidden'}`}>{link.label}</p>
          }
          { isMobileNav &&
          <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>{link.label}</p>
          }
        </Link>
      )
      return linkComponent
    })}
    </div>
  )
}

export default NavLinks
