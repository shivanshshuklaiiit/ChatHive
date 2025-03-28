import { Hash, Menu } from 'lucide-react';
import React from 'react'
import { MobileToogel } from '../mobile-toogle';
import { UserAvatar } from '../user-avatar';
import SocketIndicator from '../socket-inxicator';
import { ChatVideoButton } from '../chat-video-button';
interface chatHeaderProps{
    serverId:string,
    name:string,
    type:"channel"|"conversation" ;
    imageUrl?:string
}

function ChatHeader({
    serverId,
    name,
    type,
    imageUrl
}:chatHeaderProps) {
  return (
    <div className='text-md font-semibold px-3 flex items-center
      h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
        <MobileToogel serverId={serverId}/>
        {type === "channel" && (
            <Hash className='w-5 h-5 text-zinc-500
             dark:text-zinc-400 mr-2'/>
        )}

        {type==="conversation" &&(
          <UserAvatar
            src={imageUrl}
            classname='h-8 w-8 md:h-8 md:w-8 mr-2'
          />
        )}

        <p className='font-semibold text-md text-black 
          dark:text-white'>
            {name}
        </p>

        <div className='ml-auto flex items-center '>
          {type === "conversation" && <ChatVideoButton/> }
          <SocketIndicator/>
        </div>
    </div>
  )
}

export default ChatHeader