
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



interface VideoCardProps {
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

const VideoCard:React.FC<VideoCardProps> = async ({
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
    <Card className="w-[40rem] h-[60rem] aspect-auto rounded-3xl my-8 flex relative flex-col">
        <CardHeader className="flex relative flex-row items-center justify-start space-x-4">
            <Avatar className='w-[4rem] h-[4rem] inline-flex border-red-700 border-2'>
                <AvatarImage src={avatar} width={100} height={100} className='object-cover relative' alt='shadcn' />
                <AvatarFallback className='font-bold text-5xl' >?</AvatarFallback>
            </Avatar>
                <Link prefetch={true} href={`${userid}`}>
                    <CardTitle className="font-bold text-3xl">@{username}</CardTitle>
                </Link>
        </CardHeader>
        <CardContent className="relative w-full flex items-center justify-center">
            <div className="block mx-auto relative w-full h-[40rem]">
                <AspectRatio ratio={2 / 3} >
                    <video src={content} controls autoPlay={true} loop={true} muted className="h-[40rem] mx-auto relative flex aspect-[2/3] rounded-3xl" />
                </AspectRatio>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center relative justify-start">
            <div className="flex relative w-full h-full items-center space-x-2">
                <Avatar className='w-[2rem] h-[2rem] inline-flex border-red-700 border-2'>
                    <AvatarImage src={avatar} width={100} height={100} className='object-cover relative' alt='shadcn' />
                    <AvatarFallback className='font-bold text-5xl' >?</AvatarFallback>
                </Avatar>
                <Link prefetch={true} href={`${userid}`}>
                    <CardTitle className="font-bold text-3xl">@{username}</CardTitle>
                </Link>
            </div>
            <CardDescription className="flex relative w-full h-full items-center justify-start px-12">
                <p className="text-left text-lg text-foreground">{description}</p>
            </CardDescription>
        </CardFooter>
    </Card>
    
  )
}

export default VideoCard