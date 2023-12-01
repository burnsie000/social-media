import React from 'react'
import { cookies } from "next/headers"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ResolvingMetadata, Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export const dynamicParams = true

type Props = {
    params: { id: string },
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: Props,
    parent: ResolvingMetadata): Promise<Metadata> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.from('profiles').select('username').eq('username', params.id.split('-')[0]).single()
    params.id = await `${data?.username}-followers`
    const username = await data?.username
    console.log(username)

return {
    title: `${username} is following`,
}
}

const page = async ({params}: Props) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const getFollowingUsers = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data, error } = await supabase.from('profiles').select('following_users').eq('username', params.id.split('-follow')[0]).single()
        const following = await data?.following_users
        const followingUsers = await String(following)
        const followingUsersArray = await followingUsers.split(',')
        const followingItem = await followingUsersArray.map((following) => {
            return following
        })
        console.log(followingItem)
        return followingItem
    }

    const getUsername = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data, error } = await supabase.from('profiles').select('username').eq('username', params.id.split('-')[0]).single()
        const username = await data?.username
        console.log(username)
        return username
    }
    
    const username = await getUsername()
    const following = await getFollowingUsers()
    console.log(following)
    const followItem = await following?.map( async (follow) => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data, error } = await supabase.from('profiles').select().eq('username', follow).single()
        const { data: { publicUrl } } = await supabase.storage.from('avatar').getPublicUrl(`${data?.id}/avatar`)
        return (
            <div key={data?.id} className='flex-1 flex-row relative w-[40rem] py-2 my-2 items-center border-2 border-red-700 rounded-3xl justify-center'>
                <Link prefetch={true} href={`/profile/${data?.username}`}>
                    <Avatar className='w-[3rem] h-[3rem] mx-auto relative border-red-700 border-4'>
                        <AvatarImage src={publicUrl} alt={data?.username} width={100} height={100} className='object-cover relative'/>
                        <AvatarFallback className='font-bold text-5xl'></AvatarFallback>
                    </Avatar>
                    <p className='font-bold text-2xl text-center mx-auto relative'>@{data?.username}</p>
                    <p className='font-bold text-lg text-center mx-auto relative'>{data?.first_name} {data?.last_name}</p>
                </Link>
            </div>
        )
    })

  return (
    <div className='w-full flex relative px-6 py-4 items-center justify-center'>
      <div className='flex flex-1 relative w-full items-center justify-center'>
        <Link role='button' aria-label='back' prefetch={true} href={`/profile/${username}`} className='relative top-[-3rem] w-[5rem] text-center block bg-background border-2 border-foreground rounded-2xl'>Back</Link>
      </div>
      <div className='flex flex-col relative items-center w-full justify-center'>
        {followItem}
      </div>
    </div>
  )
}

export default page