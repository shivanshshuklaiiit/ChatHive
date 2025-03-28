"use client"

import qs from "query-string";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import axios from 'axios'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle

} from '@/components/ui/dialog'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage

} from '@/components/ui/form'

import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-state";
import { ChannelType } from "@prisma/client";
import { SelectContent } from "@radix-ui/react-select";
import { useEffect } from "react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }).refine(
        name=>name !=="general",
        {
            message:"Channel name cannot be 'general'"
        }
          
        
    ),

    type:z.nativeEnum(ChannelType)


})

export const EditChannelModal =() => {
    const {isOpen, onClose,type,data} =useModal()

    const router = useRouter()
    const params =useParams()

    const isModalOpen =isOpen && type === "editChannel"
    const {channel,server}= data;
    console.log(channel)

   

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type:channel?.type || ChannelType.TEXT
           
        }
    })

    useEffect(()=>{
        if(channel){
            form.setValue("name",channel.name)
            form.setValue("type",channel.type)
        }
        
    },[form,channel])

    

    const isLoading = form.formState.isSubmitting
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
              url:`/api/channels/${channel?.id}`  ,
              query:{
                serverId:server?.id
              }
            })
            await axios.patch(url, values);
            
            form.reset()
            router.refresh()
            onClose()

        }catch(error){
            console.log(error)
        }
        

    }

    const handelclose=()=>{
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handelclose}>
         <DialogContent className='bg-white text-black p-0 
            overflow-hidden'>
                 <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Edit channel
                    </DialogTitle>

                </DialogHeader> 

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-8">

                        <div className="space-y-8 px-6">
                        
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                         className="uppercase text-xs font-bold text-zinc-500
                                         dark:text-secondary/70"
                                        >
                                            Channel Name
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0
                                                "
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control= {form.control}
                                name="type"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                           Channel Type  
                                        </FormLabel>

                                        <Select
                                          disabled={isLoading}
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0
                                                    focus:ring-0 text-black ring-offset-0
                                                    focus:ring-offset-0 capitalize 
                                                    outline-none"
                                                >
                                                    <SelectValue placeholder="Select a channel type "/>

                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(ChannelType).map((type)=>(
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLocaleLowerCase()}

                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                        <FormMessage/>

                                        
                                    </FormItem>
                                )}

                            />

                        </div>


                        <DialogFooter className="bg-gray-500 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">
                               Save  
                            </Button>
                        </DialogFooter>

                    </form>

                </Form>

            </DialogContent> 
        </Dialog>
        
    )
}