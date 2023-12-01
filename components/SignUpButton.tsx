"use client"
import React from 'react'
import { useToast } from "@/components/ui/use-toast"

interface SignUpButtonProps {
    formAction: Function
}

const SignUpButton: React.FC<SignUpButtonProps> = ({formAction}) => {
    const { toast } = useToast()
  return (
    <button formAction={formAction()} onClick={() => {
        toast({
            title: 'Account Created',
            description: 'Your account has been created. Please check your email to verify your account.',
        })
    }} 
    className="border border-red-700 rounded-md px-4 py-2 text-foreground mb-2">
        Sign Up
    </button>
  )
}

export default SignUpButton