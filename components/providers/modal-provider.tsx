"use client"
import { useEffect, useState } from "react"
import { CreateServerModal } from "../modals/create-server-modal"
import { InviteServerModal } from "../modals/invite-modal"
import { EditServerModal } from "../modals/edit-server-modal"
import { MembersModal } from "../modals/members-modal"
import { CreateChannelModal } from "../modals/create-channel-modal"
import { LeaveServerModal } from "../modals/leave-server-modal"
import { DeleteServerModal } from "../modals/delete-server"
import { DeleteChannelModal } from "../modals/delete-channel"
import { EditChannelModal } from "../modals/edit-channel-moadl"
import { MessageFileModal } from "../modals/message-file"
import { DeleteMessageModal } from "../modals/delete-message-modal"

export const ModalProvider =()=>{
    const [isMounted,setIsMounted] =useState(false)
    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null
    }

    return (
        <>
          <CreateServerModal/>
          <InviteServerModal/>
          <EditServerModal/> 
          <MembersModal/>
          <CreateChannelModal/>
          <LeaveServerModal/>
          <DeleteServerModal/>
          <DeleteChannelModal/>
          <EditChannelModal/>
          <MessageFileModal/>
          <DeleteMessageModal/>
        </> 
    )
}