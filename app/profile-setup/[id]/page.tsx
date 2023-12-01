import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"


interface Id {
    params: { id: string }
}

type DateType = {
    new(): Date
}

const page = async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: {session} } = await supabase.auth.getSession()
    const { data: {user}} = await supabase.auth.getUser()
    const created_at = await user?.created_at.split('T')[0]
    const last_online = await user?.last_sign_in_at
    const last_online_time = new Date(`${last_online}`).toLocaleTimeString()
    const last_online_at_hour = last_online_time.split(':')[0]
    const last_online_at_minutes = last_online_time.split(':')[1]
    const last_online_at_TOD = last_online_time.split(' ')[1]
    const id = await user?.id
    if (!session) {
        return redirect('/login')
    }
    // update user profile
    const updateUserProfile = async (formData: FormData) => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        async function uploadFile(formData: FormData) {
            'use server'
            const avatar = formData.get('avatar') as FormDataEntryValue
            const name = avatar.toString()
            const cookieStore = cookies()
            const supabase = createClient(cookieStore)
            const { data, error } = await supabase.storage.from('avatar').upload(`/${id}/avatar`, avatar, {
                cacheControl: '1',
                upsert: true,
        
            })
        }
        const { data: { user } } = await supabase.auth.getUser()
        const id = user?.id
        const first_name = formData.get('first_name') as string
        const last_name = formData.get('last_name') as string
        const username = formData.get('username') as string
        const date_of_birth = formData.get('date_of_birth') as string
        const bio = formData.get('bio') as string
        const { error } = await supabase.from('profiles').update({ first_name, last_name, username, date_of_birth, bio }).eq('id', id)
        if (error) {
            return redirect('/profile-setup/[id]?message=Could not update profile')
        }
    }
    
    const { data: {publicUrl} } = await supabase.storage.from('avatar').getPublicUrl(`${id}/avatar`)
  return (
    <div className="flex-1 py-10 items-center flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 top-[-15rem] relative">
        <h1 className="text-4xl mt-[15rem] flex mx-auto relative text-center font-bold">Profile Setup</h1>
        <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={updateUserProfile}
        >
            <div className='relative flex flex-col mx-auto items-center space-y-[0.5rem] justify-center w-[50%]'>
                    <Avatar className='w-[8rem] h-[8rem] mx-auto border-red-700 border-4'>
                        <AvatarImage src={publicUrl} width={100} height={100} className='object-cover relative' alt='shadcn' />
                        <AvatarFallback className='font-bold text-5xl' >?</AvatarFallback>
                    </Avatar>
                    
                    <label className='text-md cursor-pointer font-semibold relative underline text-center'>
                        <input className='hidden relative' name='avatar' type="file" accept='image/*' />
                        Change Avatar
                    </label>
                    <p className='text-sm font-semibold text-center relative'>Last seen {last_online_at_hour}:{last_online_at_minutes} {last_online_at_TOD}</p>
                </div>
            <label className="text-md" htmlFor="first_name">
            First Name
            </label>
            <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="first_name"
            placeholder="John"
            required
            />
            <label className="text-md" htmlFor="last_name">
            Last Name
            </label>
            <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="last_name"
            placeholder="Doe"
            required
            />
            <label className="text-md" htmlFor="username">
            Username
            </label>
            <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="username"
            placeholder="username"
            required
            />
            <label className="text-md" htmlFor="date_of_birth">
            Date of Birth
            </label>
            <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type='date'
            name="date_of_birth"
            placeholder="YY/MM/DD"
            required
            />
            <label className="text-md" htmlFor="bio">Bio</label>
            <Textarea placeholder='Bio - 250 characters max' name='bio' />

            <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
            Complete Profile
            </button>
        </form>
    </div>
  )
}

export default page