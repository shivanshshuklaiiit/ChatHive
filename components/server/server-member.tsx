"use client"
import { cn } from '@/lib/utils'
import { Member, MemeberRole, Profile, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { UserAvatar } from '../user-avatar'

interface ServerMemberProps{
    member:Member & {profile:Profile}
    server:Server
}

const roleIconMap={
    [MemeberRole.GUEST]:null,
    [MemeberRole.MODERATOR]:<ShieldCheck className='
     h-4 w-4 ml-2 text-indigo-500'/>,
    [MemeberRole.ADMIN]:<ShieldAlert className='
     h-4 w-4 ml-2 text-rose-500'/>
}

function ServerMember({member,server}:ServerMemberProps) {

    const params = useParams()
    const router = useRouter()

    const icon= roleIconMap[member.role]

    const onCLick = ()=>{
      router.push(`/servers/${params?.serverId}/conversations/${member.id}`)

    }

    return (
      <button 
        onClick={onCLick}
        className={cn(
        "group px-2 py-2 rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId=== member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}>
          <UserAvatar src={member.profile.imageUrl}
            classname='h-6 w-6  rounded-full '
          />
          <p
           className={cn(
            "font-semibold text-xs ml-1  text-zinc-500 group-hover:text-zinc-600  dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memeberId=== member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
           )}
          >
            {member.profile.name}
          </p>
          {icon}
      </button>
    )
}

export default ServerMember