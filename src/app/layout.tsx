import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export const metadata = {
  title: "District 300 Blog",
  description: "A blog for Unifor Local 2002 District 300",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}

