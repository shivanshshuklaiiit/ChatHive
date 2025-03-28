"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle

} from '@/components/ui/dialog'

import { useModal } from "@/hooks/use-model-state";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';




export const InviteServerModal= () => {
    const {onOpen,isOpen, onClose,type,data} =useModal()
    const origin = useOrigin();

    const {server} = data
    const [copied,setCopied]=useState(false)
    const [isLoadind , setIsLoading]=useState(false)

    const isModalOpen =isOpen && type === "invite"
    const inviteUrl=`${origin}/invite/${server?.invitationCode}`;

    // to copy invite link
    const onCopy = ()=>{
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true)

        setTimeout(()=>{
            setCopied(false)
        },1000)
    }

    // to genrate new invite link
    const onNew = async()=>{
        try{
            setIsLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/inviteCode`)
            onOpen("invite",{server:response.data});
        }catch(error){
            console.log(error)
        }finally{
            setIsLoading(false)
        }

    }
   
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>

            <DialogContent className='bg-white text-black p-0 
            overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Invite Friends
                    </DialogTitle>

                
                </DialogHeader>

              <div className='p-6'>
                <Label
                    className='uppercase text-xs front-bold text-zinc-500 dark:text-secondary/70'
                >
                    Server invite link
                </Label>

                <div className='flex items-center mt-2 gap-x-2 '>
                    <Input
                      disabled={isLoadind}
                      className='bg-zinc-300/50 border-0
                      focus-visible:ring-0 text-black
                      focus-visible:ring-offset-0'
                      value ={inviteUrl}
                    />

                    <Button disabled={isLoadind} onClick={onCopy} size="icon">
                        {copied?<Check className='w-4 h-4'/>: 
                        <Copy className='w-4 h-4'/>}
                        
                       
                    </Button>
                </div>

                <Button
                  onClick={onNew}
                  variant="link"
                  size="sm"
                  className='text-xs text-zinc-500 mt-4'
                >
                    Generate a new link
                    <RefreshCcw className='ml-1 h-4 w-4'/>
                </Button>
              </div>

            </DialogContent>
        </Dialog>
    )
}