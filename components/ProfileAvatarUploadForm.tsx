import { SupabaseClient } from '@supabase/supabase-js';
import React from 'react'

interface ProfileAvatarUploadFormProps {
    onSubmit: Function
}


const ProfileAvatarUploadForm: React.FC<ProfileAvatarUploadFormProps> = ({onSubmit}) => {
  return (
    <form onSubmit={onSubmit()}>
        <input className='flex relative' name='avatar' type="file" accept='image/*' />
        <button className='flex realtive' type="submit">Upload</button>
    </form>
  )
}

export default ProfileAvatarUploadForm