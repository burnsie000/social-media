import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from './ThemeToggle'

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('profiles').select('username').eq('id', user?.id).single()

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return user ? (
    <>
      <div className="flex items-center gap-4">
        <Separator orientation='vertical' decorative className='h-[3rem] border-red-700 w-[0.5px] border-l-[1px] mr-3' />
        <p>
          Hey, {data?.username}
        </p>
        
        <form action={signOut}>
          <button className="py-2 font-bold px-4 bg-red-700 rounded-3xl no-underline bg-btn-background hover:bg-btn-background-hover">
            Logout
          </button>
        </form>
        <div className='mx-auto relative flex'>
          <ModeToggle />
        </div>
      </div>
      
    </>
    
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  )
}
