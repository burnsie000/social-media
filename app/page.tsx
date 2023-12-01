import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PostCard from '@/components/PostCard'

export default async function Index() {
  
  const cookieStore = cookies()

  const supabase = createClient(cookieStore)
  const { data: {user} } = await supabase.auth.getUser()
  const id = await user?.id
  const { data: { session } } = await supabase.auth.getSession()

  const { data, error} = await supabase.from('profiles').select().eq('id', id).single()
  const username = await data?.username

  const getPost = async () => {

    const getPostUsername = async () => {
      
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const {data, error } = await supabase.from('posts').select()
      const username = await data
      const image_path = await data
      return { data, username, image_path }
    }
    const username1 = await getPostUsername()
    const username = await username1?.data
    const imagepath = await username1?.data
    const image_path = await imagepath?.map((image) => {
      return image.image_path
    })
    const user_name = await username?.map((user) => {
      return user.username
    })
  
    const getPostPhotoPath = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data: {publicUrl} } = await supabase.storage.from('posts').getPublicUrl(`${image_path}`)
      const content = await publicUrl
      return content
    }

    const content = await getPostPhotoPath()

    const getPostCaption = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data } = await supabase.from('posts').select().single()
      const caption = await data?.caption
      return caption
    }
    const caption = await getPostCaption()
  
    const getUser_Id = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data } = await supabase.from('posts').select().single()
      const userid = await data?.user_id
      
      return userid
    }
    const userid = await getUser_Id()
  
    const getAvatar = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data: {publicUrl} } = await supabase.storage.from('avatar').getPublicUrl(`${userid}/avatar`)
      return publicUrl
    }
    const avatar = await getAvatar()
  
    const getPostId = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data } = await supabase.from('posts').select('id')
      const id = await data?.map((i) => {
        return i.id
      })
      
      return id
    }
    const post_id = await getPostId()
    const postID = await post_id?.map((id) => {
      return id
    })
  
    const getPosts = async () => {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      const { data } = await supabase.from('posts').select('*')
      return data
    }
    const posts = await getPosts()
    return { content, user_name, caption, avatar, postID, posts }
  }
  const { posts } = await getPost()
  
  
  let PostCards = posts?.reverse().map((post) => {
    const created = post.created_at.split('T')[0]
    const created_date = new Date(`${created}`).toLocaleTimeString('default', { month: 'long', day: 'numeric', year: 'numeric' })
    return (
      <div key={post.id.toString()}>
        <PostCard
          avatar={`https://yhjqzdermadrwrgecbcc.supabase.co/storage/v1/object/public/avatar/${post.user_id}/avatar`}
          username={`@${post.username}`}
          content={`https://yhjqzdermadrwrgecbcc.supabase.co/storage/v1/object/public/posts${post.image_path}`}
          description={post.caption}
          userid={`/profile/${post.username.toString()}`}
          id={post.id.toString()}
          created_at={created_date}
        />
      </div>
    )
  })
  return (
    <main className='flex flex-col relative gap-12 py-8'>
      {PostCards}
    </main>
  )
}
