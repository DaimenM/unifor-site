import { SidebarTrigger } from "@/components/ui/sidebar";

import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbList } from "@/components/ui/breadcrumb";

export default function Contact() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6 animate-fade-up [animation-fill-mode:forwards]">
          <SidebarTrigger
            className="md:hidden text-red-600 flex-shrink-0"
            size={"icon"}
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
      <h1 className="text-4xl font-bold text-red-600 mb-6">Contact</h1>
    </main>
  );
}
