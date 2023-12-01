import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'



const page = async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: {session} } = await supabase.auth.getSession()
    const { data: {user}} = await supabase.auth.getUser()
    const id = await user?.id
    if (!session) {
        return redirect('/login')
    } else {
        // turn the user id into a string 
        const { data, error } = await supabase.from('profiles').select('username').eq('id', id).single()
        const username = await data?.username
        return redirect(`/profile/${username}`)
    }   
}
export default page