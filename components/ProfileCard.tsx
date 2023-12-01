import React from 'react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Link from 'next/link'

interface ProfileCardProps {
    image: string,
    description: string,
    postid: string
}

const ProfileCard: React.FC<ProfileCardProps> = async ({image, description, postid}) => {
  return (
    <div className='flex relative mx-auto w-full px-4'>
            <Card className='w-full flex relative mx-auto aspect-square border-white border-2'>
                <AspectRatio ratio={1 / 1} className='border-white border-2' >
                    <Link prefetch={true} href={`/post/${postid}`} className='w-full h-full'>
                        <Image src={image} alt={description} layout='fill' />
                    </Link>
                </AspectRatio>
            </Card>
        
    </div>
  )
}

export default ProfileCard