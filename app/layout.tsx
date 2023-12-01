import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/Navbar'
import { Separator } from '@/components/ui/separator'
import AuthButton from '@/components/AuthButton'
import Loading from './loading'
import { Suspense } from 'react'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <div className='relative flex justify-center px-[5rem] items-center w-full h-20'>
          <Suspense fallback={ <Loading /> } >
            <Navbar />
            <AuthButton />
          </Suspense>
        </div>
        <div className='flex relative justify-center items-center w-full pb-4'>
          <Separator orientation='horizontal' className='border-red-700 border-[0.5px] w-[90%] relative flex'/>
        </div>
        <main className="min-h-screen flex flex-col items-center">
          <ThemeProvider
            attribute="class"
            
            enableSystem
            disableTransitionOnChange >
              <Suspense fallback={ <Loading /> } >
                {children}
              </Suspense>
            </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
