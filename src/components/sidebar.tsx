import Link from "next/link"
import { Home, Info, HelpCircle, MessageCircle, FileText, ChevronDown } from 'lucide-react'
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const sidebarGeneralInfoItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Info, label: "Contact", href: "/article/contact" },
  { icon: HelpCircle, label: "FAQ", href: "/article/faq" },
  { icon: MessageCircle, label: "Messages From District Chair", href: "/article/messages-from-district-chair" },
  { icon: FileText, label: "Address Change Form", href: "https://www.unifor2002.org/Contact-Us/Moving-Update-Us-Change-of-Address-Form?lang=fr-ca" },
]

const sidebarUnionResourcesItems = [
  { icon: FileText, label: "Collective Agreement", href: "/" },
  { icon: FileText, label: "Constitution and Bylaws", href: "/" },
  { icon: FileText, label: "Union Representatives", href: "/" },
  { icon: FileText, label: "Unifor Local 2002", href: "/" },
  { icon: FileText, label: "Unifor National", href: "/" },
  { icon: FileText, label: "Women's Advocate", href: "/" },
]

const sidebarEmployeeSupportItems = [
  { icon: FileText, label: "EAP", href: "/" },
  { icon: FileText, label: "GDIP", href: "/" },
  { icon: FileText, label: "ESS Anomaly Descriptions", href: "/" },
  { icon: FileText, label: "Health and Safety", href: "/" },
  { icon: FileText, label: "Harassment in the Workplace", href: "/" },
  { icon: FileText, label: "Human Rights", href: "/" },
]

const sidebarJobEmploymentItems = [
  { icon: FileText, label: "Shift Bid", href: "/" },
  { icon: FileText, label: "Layoff", href: "/" },
  { icon: FileText, label: "Pension", href: "/" },
  { icon: FileText, label: "Insurance", href: "/" },
]

const sidebarNewsItems = [
  { icon: FileText, label: "Archived News", href: "/" },
  { icon: FileText, label: "Call to Action", href: "/" },
  { icon: FileText, label: "In Memoriam", href: "/" },
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
      <SidebarContent className="list-none [&>*]:mt-0 [&>*]:mb-0">
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>General Information</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {sidebarGeneralInfoItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>Union Resources</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {sidebarUnionResourcesItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>Employee Support</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {sidebarEmployeeSupportItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>Job and Employment</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {sidebarJobEmploymentItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                <span>News and Updates</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {sidebarNewsItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2 px-2 py-1.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}

