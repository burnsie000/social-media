import { cookies } from 'next/headers'
import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const page = async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
        return redirect('/login')
    }

    const socialPost = async (formData: FormData) => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const {data: {user}} = await supabase.auth.getUser()
        const getUsername = await supabase.from('profiles').select('username').eq('id', user?.id).single()
        const username = await getUsername.data?.username
        const user_id = await user?.id
        const video = formData.get('video') as FormDataEntryValue
        const videopost = Math.floor(Math.random() * 1000).toString()
        const caption = formData.get('caption') as string
        const { data } = await supabase.storage.from('posts').upload(`/${username}/${videopost}`, video, {
            cacheControl: '0',
            upsert: true,
        })
        const video_path = `/${username}/${videopost}`
        const { error } = await supabase.from('videos').insert({ username, video_path, caption, user_id })
        
    }

  return (
    <div className='flex flex-col relative w-full h-full items-center justify-center'>
        <form action={socialPost} className='relative flex w-auto h-auto my-12 flex-col items-center justify-center'>
            <label htmlFor='video' className='relative flex w-auto items-center self-start justify-start my-4'>Video</label>
            <input type="file" name="video" accept="video/*" className='relative flex mx-auto file:mr-5 file:py-1 file:px-3
                file:text-xs file:font-medium
                file:bg-background file:text-foreground file:border-foreground file:rounded-2xl file:border-solid file:border-2
                hover:file:cursor-pointer hover:file:bg-red-50
                hover:file:text-red-700 my-4 justify-start items-center' />
            <label htmlFor='caption' className='relative flex w-auto my-4 self-start items-center'>Caption</label>
            <input type="text" name="caption" className='relative shadow-foreground shadow-md w-full flex mx-auto justify-start items-center my-4'/>
            <button type="submit" className='relative flex mx-auto bg-background border-2 border-foreground rounded-2xl w-[5rem] text-center items-center justify-center my-4'>Post</button>
        </form>
    </div>
  )
}

export default page