import React from 'react'
import { cookies } from "next/headers"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ResolvingMetadata, Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export const dynamicParams = true

type Props = {
    params: { followers: string },
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: Props,
    parent: ResolvingMetadata): Promise<Metadata> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.from('profiles').select().eq('id', params.followers.split('-follow')[0]).single()
    params.followers = await `${data?.id.toString()}-followers`
    const username = await data?.username
    const id = await data?.id

return {
    title: `${username}'s followers`,
}
}


// Followers Page

const page = async ({params}: Props) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const getProfileFollowers = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data, error } = await supabase.from('profiles').select().eq('id', params.followers.split('-followers')[0]).single()
        const followers = await data
        const followerUsers = await String(followers?.follower_users)
        const followerUsersArray = await followerUsers.split(',')
        const followerItem = await followerUsersArray.map((follower) => {
            return follower
        })
        // console.log(followers)
        return followerItem
    }

    const getUsername = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data, error } = await supabase.from('profiles').select('username').eq('id', params.followers.split('-followers')[0]).single()
      const username = await data?.username
      return username
    }

    const username = await getUsername()
    const followers = await getProfileFollowers()
    const followItem = await followers?.map( async (follower) => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data, error } = await supabase.from('profiles').select().eq('username', follower).single()
      const {data: {publicUrl}} = await supabase.storage.from('avatar').getPublicUrl(`/${data?.id}/avatar`)
      const user = await data
        return (
          <div key={user.id} className='flex-1 flex-row relative w-[40rem] py-2 my-2 items-center border-2 border-red-700 rounded-3xl justify-center'>
            <Link prefetch={true} href={`/profile/${user.username}`}>
              <Avatar className='w-[3rem] h-[3rem] mx-auto relative border-red-700 border-4'>
                <AvatarImage src={publicUrl} alt={user.username} width={100} height={100} className='object-cover relative'/>
                <AvatarFallback className='font-bold text-5xl'></AvatarFallback>
              </Avatar>
              <p className='font-bold text-2xl text-center mx-auto relative'>@{user.username}</p>
              <p className='font-bold text-lg text-center mx-auto relative'>{user.first_name} {user.last_name}</p>
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