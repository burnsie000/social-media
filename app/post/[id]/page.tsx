import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import PostCard from '@/components/PostCard'

type Props = {
    params: { id: string }
}

export async function generateMetadata({params}: Props) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const id = params.id
    const { data } = await supabase.from('posts').select().eq('id', id).single()
    const username = await data?.username
    const description = await data?.caption
    return {
        title: `${username}'s Post`,
        description: `${description}`,
    }

}

const page = async ({params}: Props) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const id = params.id
    const { data } = await supabase.from('posts').select().eq('id', id).single()
    const image_path = await data?.image_path
    const username = await data?.username
    const caption = await data?.caption
    const user_id = await data?.user_id
    const created = await data?.created_at
    const created_at = new Date(`${created}`).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })
    const { data: {publicUrl} } = await supabase.storage.from('posts').getPublicUrl(`${image_path}`)
  return (
    <div className='relative flex my-8'>
        <PostCard 
            avatar={`https://yhjqzdermadrwrgecbcc.supabase.co/storage/v1/object/public/avatar/${user_id}/avatar`}
            username={`@${username}`}
            description={caption}
            content={publicUrl}
            userid={`/profile/${username}`}
            created_at={created_at} />
    </div>
  )
}

export default page