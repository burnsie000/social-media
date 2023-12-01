import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Separator } from "@/components/ui/separator"
import { Metadata, ResolvingMetadata } from 'next'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { revalidatePath } from 'next/cache'
import ProfileCard from '@/components/ProfileCard'
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
    const { data, error } = await supabase.from('profiles').select().eq('username', params.id).single()
    params.id = await data?.username
    const username = await data?.username
    const id = await data?.id

return {
    title: `${username}'s Profile`,
}
}

const page = async ({ params }: Props) => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data } = await supabase.from('profiles').select().eq('username', params.id).single()
    const id = data?.id
    const bio = await data?.bio
    const first_initial = await data?.first_name.charAt(0)
    const last_initial = await data?.last_name.charAt(0)
    const initials = `${first_initial}${last_initial}`
    const email = await data?.email
    const username = data?.username
    const created_at_number = data?.created_at.split('T')[0]
    const created_at = new Date(`${created_at_number}`).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })
    const last_online = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('profiles').select().eq('username', params.id).single()
        const last_online = await data?.last_sign_in_at
        const last_online_at = new Date(`${last_online}`).toLocaleTimeString('default', {month: 'long', day: 'numeric', year: 'numeric' , hour: 'numeric', minute: 'numeric' })
        return last_online_at
    }
    const last_online_date = await data?.last_sign_in_at.split('T')[0]
    const last_online_date_string = new Date(`${last_online_date}`).toLocaleTimeString('default', { month: 'long', day: 'numeric', year: 'numeric' })
    
    let last_online_at = last_online()

    async function uploadFile(formData: FormData) {
        'use server'
        const avatar = formData.get('avatar') as FormDataEntryValue
        const name = avatar.toString()
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data: {publicUrl}} = await supabase.storage.from('avatar').getPublicUrl(`${id}/avatar`)
        const { data, error } = await supabase.storage.from('avatar').update(`/${id}/avatar`, avatar, {
            cacheControl: '0',
            upsert: true,
    
        })
        
        const revalidate = async () => {
            await revalidatePath(`/profile/${username}`)
        }
        revalidate()
        

        if (error) {
            const { data, error } = await supabase.storage.from('avatar').upload(`/${id}/avatar`, avatar, {
                cacheControl: '1',
                upsert: true,
        
            })
            
            if (data) {
                const {data: {publicUrl}} = await supabase.storage.from('avatar').getPublicUrl(`${id}/avatar`)
                revalidatePath(`/profile/${username}`)
                return publicUrl
            }
            return publicUrl
        }
       
        return publicUrl
    }

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id


    const { data: {publicUrl} } = await supabase.storage.from('avatar').getPublicUrl(`${id}/avatar`)

    const getUserPosts = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('posts').select().eq('username', username)
        const posts = await data
        return posts
    }
    const posts = await getUserPosts()

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

    const profilePosts = {...posts, ...vid}
    

    const getFollowers = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('profiles').select('followers').eq('id', id)
        const followers = await data
        return followers
    }
    
    const followers1 = await getFollowers()
    const followers = await followers1?.map((follower) => {
        return follower.followers
    })
    const getFollowing = async () => {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('profiles').select('following').eq('id', id)
        const following = await data
        return following
    }
    const following1 = await getFollowing()
    const following = await following1?.map((follow) => {
        return follow.following
    })

    const addUserToFollowing = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        let { data } = await supabase.from('profiles').select('following_users').eq('id', id)
        const followingUsers = await data
        
        const followingUsers1 = await followingUsers?.map((user) => {
            return user.following_users
        })
        
        const followingUsers2 = await followingUsers1?.map((user) => {
            return user
        })
        console.log(followingUsers1)
        const userFollows = await supabase.from('profiles').select('username').eq('username', params.id)
        const userFollows1 = userFollows.data
        const userFollows2 = await userFollows1?.map((user) => {
            return user.username
        })
        console.log(userFollows2)
        const userFollows3 = await userFollows2?.map((user) => {
            return user.toString()
        })
        console.log(userFollows3?.toString())
        const userFollows4 = userFollows3?.toString()
        const userFollowsAddUser = await supabase.from('profiles').update({ following_users: userFollows3 }).eq('id', userId)
        const increaseFollowing = await supabase.from('profiles').select('following').eq('id', userId)
        const increaseFollowing1 = increaseFollowing.data
        
        const increaseFollowing2 = await increaseFollowing1?.map((user) => {
            return parseInt(user.following)
        })
        console.log(increaseFollowing2)
        const increaseFollowing3 = await increaseFollowing2?.map((user) => {
            return user + 1
        })
        const followingIncreased = Number(increaseFollowing3)
        const updateFollowing = await supabase.from('profiles').update({ following: followingIncreased }).eq('id', userId)
        if (updateFollowing.data) {
            console.log('following increased')
        }
        if (updateFollowing.error) {
            console.log(updateFollowing.error)
        }
    }

    const addUserToFollowers = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        let { data } = await supabase.from('profiles').select('username').eq('id', userId)
        const username = await data
        const username1 = await username?.map((user) => {
            return user.username
        })
        const newFollower = supabase.from('profiles').update({follower_users: username1}).eq('id', id)
        const { error } = await newFollower
        console.log(error)
        
    }

    const followauser = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('profiles').select('followers').eq('username', params.id)
        const following = await data
        const following1 = await following?.map((follow) => {
            return parseInt(follow.followers)
        })
        const following2 = await following1?.map((follow) => {
            return follow + 1
        })
        const following3 = Number(following2)
        console.log(following3)
        let checkFollowingUsers = await supabase.from('profiles').select('follower_users').eq('username', params.id)
        let currentUser = await supabase.from('profiles').select('username').eq('id', userId)
        let currentUser1 = currentUser.data
        let checkFollowingUsers1 = checkFollowingUsers.data
        let username1 = await currentUser1?.map((user) => {
            return user.username
        })
        let checkFollowingUsers2 = await checkFollowingUsers1?.map((user) => {
            return user.follower_users
        })
        let checkFollowingUsers3 = await checkFollowingUsers2?.map((user) => {
            return user
        
        })
        let username2 = await username1?.map((user) => {
            return user
        })
        console.log(checkFollowingUsers3?.toString(), username2?.toString())
        if (checkFollowingUsers3?.toString() == username2?.toString()) {
            console.log('already following')
            return { checkFollowingUsers3, username2 }
        } else {
            
            const {error} = await supabase.from('profiles').update({ followers: following3 }).eq('username', params.id)
            console.log(error)
            addUserToFollowers()
            addUserToFollowing()
        }
    }
    const checkFollowingUsers = await supabase.from('profiles').select('follower_users').eq('username', params.id)
    const checkFollowingUsers1 = checkFollowingUsers.data
    const currentUser = await supabase.from('profiles').select('username').eq('id', userId)
    const currentUser1 = currentUser.data
    const followingUser = await checkFollowingUsers1?.map((user) => {
        return user.follower_users
    })
    const currentUser2 = await currentUser1?.map((user) => {
        return user.username
    })
    const followingUser1 = await followingUser?.map((user) => {
        return user
    })
    const currentUser3 = await currentUser2?.map((user) => {
        return user
    })
    

    const removeUserFromFollowing = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        let { data, error } = await supabase.from('profiles').select('username').eq('id', userId)
        const username = await data?.map((user) => {
            return user.username
        })
        let followingUsers = await supabase.from('profiles').select('follower_users').eq('id', id)
        const followingUsers1 = followingUsers.data
        const followingUsers2 = await followingUsers1?.map((user) => {
            return user.follower_users
        })
        const remove = await supabase.from('profiles').select('follower_users').eq('id', id)
        const remove1 = remove.data
        const remove2 = await remove1?.map((user) => {
            return user.follower_users
        })
        const remove3 = await remove2?.map((user) => {
            return user.toString()
        })
        const unfollowthisuser = await remove3?.filter((user) => {
            return user !== username?.toString()
        })
        const unfollowthisuser1 = await unfollowthisuser?.map((user) => {
            return user.toString()
        })
        const unfollowthisuser2 = await supabase.from('profiles').update({ follower_users: unfollowthisuser1 }).eq('id', id)
    }
    const decreaseFollowing = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data, error} = await supabase.from('profiles').select('following').eq('id', userId)
        const following = data?.map((user) => {
            return user.following
        })
        console.log(following)
        const following1 = following?.map((user) => {
            return user - 1
        })
        console.log(following1)
        const decreaseFollowing = await supabase.from('profiles').update({ following: Number(following1) }).eq('id', userId)
        console.log(decreaseFollowing.data, decreaseFollowing.error)
    }

    const removeFollowingUser = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('profiles').select('following_users').eq('id', userId)
        const followingUsers = await data
        const followingUsers1 = await followingUsers?.map((user) => {
            return user.following_users
        })
        const followingUsers2 = await followingUsers1?.map((user) => {
            return user
        })
        const followingUsers3 = await followingUsers2?.map((user) => {
            return user.toString()
        })
        const followingUsers4 = await followingUsers3?.filter((user) => {
            return user !== params.id
        })
        const followingUsers5 = await followingUsers4?.map((user) => {
            return user.toString()
        })
        const followingUsers6 = await supabase.from('profiles').update({ following_users: followingUsers5 }).eq('id', userId)
        console.log(followingUsers6.data, followingUsers6.error)
    }

    const unfollowUser = async () => {
        'use server'
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const { data } = await supabase.from('profiles').select('followers').eq('username', params.id)
        const following = await data
        const following1 = await following?.map((follow) => {
            return parseInt(follow.followers)
        })
        const following2 = await following1?.map((follow) => {
            return follow - 1
        })
        const following3 = Number(following2)
        const {error} = await supabase.from('profiles').update({ followers: following3 }).eq('username', params.id)
        removeUserFromFollowing()
        decreaseFollowing()
        removeFollowingUser()
        
    }

  return (
    <div className='w-full flex-col relative text-center bg-background'>
        <div className='w-full flex flex-row relative items-center justify-between text-center bg-background py-3'>
            <div>

            </div>
            <div>           
                <h2 className='text-lg font-semibold text-center relative'>Profile</h2>
            </div>
            <div>

            </div>
        </div>
        <div className='w-full flex flex-col items-center relative text-center bg-background'>
            <div className='flex flex-row relative justify-center space-x-14 my-[2rem]'>
                <div className='relative flex flex-col items-center space-y-[0.5rem] justify-center w-[50%]'>
                    <form>
                        <Avatar className='w-[8rem] h-[8rem] mx-auto border-red-700 border-4'>
                            <AvatarImage src={publicUrl} width={100} height={100} className='object-cover relative' alt='shadcn' />
                            <AvatarFallback className='font-bold text-5xl' >{initials}</AvatarFallback>
                        </Avatar>
                    </form>
                    { id === userId ? 
                    <form action={uploadFile}>
                        <label className='text-md cursor-pointer font-semibold relative underline text-center'>
                            <input className='hidden relative' name='avatar' type="file" accept='image/*' />
                            Change Avatar
                        </label>
                        <button className='flex relative text-center mx-auto bg-transparent rounded-3xl w-[5rem] items-center px-2 justify-center border-2 border-red-700 my-[0.5rem]' type="submit"><p className='flex relative'>Update</p></button>
                    </form> : null }
                    <p className='text-md font-bold text-center relative'>Last Online:</p> 
                    <p className='text-sm font-semibold text-center relative'>{last_online_at}</p>
                </div>
                <Separator decorative orientation='vertical' className='border-foreground border-[1px] h-[10rem]'/>
                <div className='flex flex-col justify-center items-start top-[-2rem] space-y-[0.5rem] relative mx-auto'>
                    <h1 className='text-3xl font-extrabold text-foreground text-center relative'>@{username}</h1>
                    <div className='flex flex-row relative justify-center items-center space-x-4 my-4'>
                        <div className='flex flex-col relative justify-center items-center'>
                            <p className="text-center text-md font-bold text-foreground relative">Followers</p>
                            <Link prefetch={true} href={`/profile/${params.id}/${id}-followers`}><p className="text-center text-md font-semibold text-foreground relative">{followers}</p></Link>
                        </div>
                        <div className='flex flex-col relative justify-center items-center'>
                            <p className="text-center text-md font-bold text-foreground relative">Following</p>
                            <Link prefetch={true} href={`/following/${params.id}-following`}><p className="text-center text-md font-semibold text-foreground relative">{following}</p></Link>
                        </div>
                    </div>
                    { id !== userId && currentUser3?.toString() !== followingUser1?.toString() ? <form action={followauser}><button className='flex relative text-center bg-transparent rounded-3xl w-[11rem] items-center px-2 justify-center border-2 border-red-700 my-[0.5rem]' type="submit"><p className='flex relative'>Follow</p></button></form> : null}
                    { currentUser3?.toString() == followingUser1?.toString() ? <form action={unfollowUser}><button className='flex relative text-center bg-transparent rounded-3xl w-[11rem] items-center px-2 justify-center border-2 border-red-700 my-[0.5rem]' type="submit"><p className='flex relative'>Unfollow</p></button></form> : null }
                    <p className='text-md font-semibold text-center relative'>Joined: {created_at}</p>

                    <Separator decorative orientation='horizontal' className='border-foreground border-[1px] w-full'/>
                    {// <p className='text-md font-semibold text-center relative'>Bio:</p>
                    }
                    <p className='text-sm font-regular text-left relative w-[24rem]'>{bio}</p>
                </div>
            </div>
            <Separator decorative orientation='horizontal' className='border-foreground border-[1px] w-[50%]'/>
        </div>
        <div className='relative items-center justify-center grid grid-cols-3 mx-auto w-full p-12'>
            {posts?.reverse().map((post) => {
                return (
                    <ProfileCard
                        key={post.id}
                        description={post.description}
                        image={`https://yhjqzdermadrwrgecbcc.supabase.co/storage/v1/object/public/posts${post.image_path}`}
                        postid={post.id}
                    />
                )
            })}
        </div>
    </div>
  )
}

export default page