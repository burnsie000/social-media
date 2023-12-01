
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import React from 'react'
import Image from "next/image"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Link from "next/link"



interface PostCardProps {
    avatar?: string,
    username?: string,
    likes?: number,
    comments?: number,
    description?: string,
    content: string,
    userid: string,
    id?: string,
    created_at?: string,
}

const PostCard:React.FC<PostCardProps> = async ({
    avatar,
    username,
    likes,
    comments,
    description,
    content,
    userid,
    id,
    created_at
}) => {
  return (
    <div>
        <Card className="w-[40rem] h-[50rem] rounded-3xl flex relative flex-col">
            <CardHeader className="flex relative flex-row items-center justify-start space-x-4">
                <Avatar className='w-[4rem] h-[4rem] inline-flex border-red-700 border-2'>
                    <AvatarImage src={avatar} width={100} height={100} className='object-cover relative' alt='shadcn' />
                    <AvatarFallback className='font-bold text-5xl' >?</AvatarFallback>
                </Avatar>
                    <Link prefetch={true} href={`${userid}`}>
                        <CardTitle className="font-bold text-3xl">{username}</CardTitle>
                    </Link>
            </CardHeader>
            <Link prefetch={true} href={`/post/${id}`}>
                <CardContent className="relative flex items-center justify-center">
                    <AspectRatio ratio={3 / 2} >
                        <Image src={content} alt='test' layout='fill' className="mx-auto object-fit relative flex aspect-[3/2]" />
                    </AspectRatio>
                </CardContent>
            </Link>
            <CardFooter className="flex flex-col items-center relative justify-start">
                <div className="flex relative w-full h-full items-center space-x-2">
                    <Avatar className='w-[2rem] h-[2rem] inline-flex border-red-700 border-2'>
                        <AvatarImage src={avatar} width={100} height={100} className='object-cover relative' alt='shadcn' />
                        <AvatarFallback className='font-bold text-5xl' >?</AvatarFallback>
                    </Avatar>
                    <Link prefetch={true} href={`${userid}`}>
                        <p className="font-semibold text-lg">{username}</p>
                    </Link>
                </div>
                <p className="font-regular text-start self-start relative flex my-2 mx-10 justify-start text-md">{description}</p>
            </CardFooter>
            <div className="flex relative px-8 justify-end items-start flex-col h-full">
                <p className="text-md font-regular text-slate-500 items-start mb-4 relative flex">{created_at}</p>
            </div>
        </Card>
    </div>
  )
}

export default PostCard