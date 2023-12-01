import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

const page = async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
        return redirect('/login')
    } else {
        // turn the user id into a string 
        const { data: {user} } = await supabase.auth.getUser()
        const id = user?.id
        return redirect(`/profile-setup/${id}`)
    }
}
export default page