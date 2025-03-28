"use client"

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ArrowUp, Loader2, ServerCrash } from "lucide-react";
import {format} from 'date-fns'
import { Fragment ,useRef, ElementRef} from "react";
import { ChatItem } from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scrool";

const DATE_FORMAT= "d MMM yyyy, HH:mm"

type MessageWithProfileWithMember = Message & {
  member:Member & {
    profile:Profile
  }
}

interface chatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: "channel" | "conversation";
}

function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type
}: chatMessagesProps) {

  const queryKey =`chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey =`chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)


  const {
    data ,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
    }=useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })

  useChatSocket({queryKey,addKey ,updateKey})
  useChatScroll({
    chatRef,bottomRef,loadMore:fetchNextPage,
    shouldLoadMore:!isFetchingNextPage && !!hasNextPage,
    count:data?.pages?.[0].items?.length ?? 0
  })

  if(status ==="pending"){
    return (
      <div className="flex-grow flex flex-col gap-y-2 justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400/85 dark:text-zinc-500/85" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ">Loading messages...</p>
      </div>
  )

  }

//   if (status === "error") {
//     return (
//         <div className="flex-grow flex flex-col gap-y-2 justify-center items-center">
//             <ServerCrash className="w-8 h-8 text-rose-400/85 dark:text-rose-500/85" />
//             <p className="text-sm font-medium text-rose-400 dark:text-rose-500 ">Something went wrong! Please try again later.</p>
//         </div>
//     )
// }
  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col py-4 overflow-y-auto"
    >
      {!hasNextPage && <div className="flex-1"/>}

      {!hasNextPage && <ChatWelcome
        type={type}
        name={name}
      />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ?(
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin
            my-4"/>
          ):(
            <button
              onClick={()=>fetchNextPage()} 
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-sm
              darK:hover:text-zinc-300 my-4 transition"
            >
              Load previus messages 
            </button>
          ) }

        </div>
      )}

      <div   className="flex flex-col-reverse mt-auto">
        {
          data?.pages?.map((group,i )=>(
            <Fragment key ={i}>
              {group.items.map((message:MessageWithProfileWithMember)=>(
                <div key={message.id}>
                  <ChatItem
                    key={message.id}
                    id={message.id}
                    currentMember={member}
                    member={message.member}
                    content={message.content}
                    fileurl={message.fileUrl}
                    deleted={message.deleted}
                    timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                    isUpdated={message.updatedAt !== message.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                  />
                </div>
              ))}
            </Fragment>
          ))
        }
      </div>

      <div ref={bottomRef}/>
    </div>
  );
}

export default ChatMessages;
