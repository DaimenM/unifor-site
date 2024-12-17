import Link from "next/link"
import { Home, FileText, Info } from 'lucide-react'
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import next from "next"

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Info, label: "Contact", href: "/contact" },
  { icon: FileText, label: "The Future of AI", href: "/article/1" },
  { icon: FileText, label: "Sustainable Living", href: "/article/2" },
  { icon: FileText, label: "Remote Work Trends", href: "/article/3" },
  { icon: FileText, label: "Deep Sea Exploration", href: "/article/4" },
  { icon: FileText, label: "Mindfulness Practices", href: "/article/5" },
]

export function AppSidebar() {
  return (
    <Sidebar side="left">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                  <Image className="rounded-lg" src="/DISTR-300.png" alt="Logo" width={30} height={30}/>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">District 300</span>
                  <span className="text-xs">Unifor Local 2002</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

