"use client"
import React from 'react'
import { useToast } from "@/components/ui/use-toast"


const LoginButton = () => {
    const { toast } = useToast()
  return (
    <button  onClick={() => {
        toast({
            title: 'Signed In',
            description: 'You have been signed in.',
        })
    }} 
    className="border-none bg-red-700 rounded-md px-4 py-2 text-foreground mb-2">
        Log In
    </button>
  )
}

export default LoginButton