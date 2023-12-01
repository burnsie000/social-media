import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import VideoCard from '@/components/VideoCard'

const page = async () => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const userSession = await supabase.auth.getSession()
    if (!userSession.data.session) {
        return redirect('/login')
    }

    const { data: {user} } = await supabase.auth.getUser()
    const id = await user?.id
    const { data: { session } } = await supabase.auth.getSession()

    const { data, error} = await supabase.from('profiles').select().eq('id', id).single()
    const username = await data?.username
    

        const getVideo = async () => {

        const getVideoUsername = async () => {
            const cookieStore = cookies()
            const supabase = createClient(cookieStore)
            const { data, error } = await supabase.from('videos').select()
            const username = await data
            return { data }
        }
        const { data } = await getVideoUsername()
        
        return { data }
    }
    const data1 = await getVideo()
    const videos = await data1.data
    const vid = videos?.map((video) => {
        return video
    })
    const VideoCards = await vid?.map((video) => {
        const created = video.created_at.split('T')[0]
        const created_at = new Date(`${created}`).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric'})
        return (
            <div key={video.id.toString()} className='relative flex'>
                <VideoCard username={video.username} description={video.caption} content={`https://yhjqzdermadrwrgecbcc.supabase.co/storage/v1/object/public/posts${video.video_path}`} userid={video.username} avatar={`https://yhjqzdermadrwrgecbcc.supabase.co/storage/v1/object/public/avatar/${video.user_id}/avatar`} created_at={created_at} id={video.id} />
            </div>
        )
    })
  return (
    <div className='relative flex flex-col'>
        {VideoCards}
    </div>
  )
}

export default page