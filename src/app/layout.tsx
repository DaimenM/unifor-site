import "./globals.css"
import { Inter } from 'next/font/google'
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`${inter.className} bg-white text-gray-800`}>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}

