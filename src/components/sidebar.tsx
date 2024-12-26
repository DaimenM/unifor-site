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
  { icon: FileText, label: "Collective Agreement", href: "/article/collective-agreement" },
  { icon: FileText, label: "Constitution and Bylaws", href: "/article/constitution-and-bylaws" },
  { icon: FileText, label: "Union Representatives", href: "/article/union-representatives" },
  { icon: FileText, label: "Unifor Local 2002", href: "/article/unifor-local-2002" },
  { icon: FileText, label: "Unifor National", href: "/article/unifor-national" },
  { icon: FileText, label: "Women's Advocate", href: "/article/womens-advocate" },
]

const sidebarEmployeeSupportItems = [
  { icon: FileText, label: "EAP", href: "/article/eap" },
  { icon: FileText, label: "GIDIP", href: "/article/gidip" },
  { icon: FileText, label: "ESS Anomaly Descriptions", href: "/article/ess-anomaly-descriptions" },
  { icon: FileText, label: "Health and Safety", href: "/article/health-and-safety" },
  { icon: FileText, label: "Harassment in the Workplace", href: "/article/harassment-in-the-workplace" },
  { icon: FileText, label: "Human Rights", href: "/article/human-rights" },
]

const sidebarJobEmploymentItems = [
  { icon: FileText, label: "Shift Bid", href: "/article/shift-bid" },
  { icon: FileText, label: "Layoff", href: "/article/layoff" },
  { icon: FileText, label: "Pension", href: "/article/pension" },
  { icon: FileText, label: "Insurance", href: "/article/insurance" },
]

const sidebarNewsItems = [
  { icon: FileText, label: "Archived Articles", href: "/archive" },
  { icon: FileText, label: "Call to Action", href: "/article/call-to-action" },
  { icon: FileText, label: "In Memoriam", href: "/article/in-memoriam" },
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

