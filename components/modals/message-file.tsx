"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { FileUpload } from '../file-upload'
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-model-state'
import qs from 'query-string';

const formSchema = z.object({

    fileUrl: z.string().min(1, {
        message: 'Attachment  is required'
    })


})



export const MessageFileModal =()=>{

    const {isOpen, onClose, type , data }=useModal()
    const router = useRouter()
    const {apiUrl,query }= data

    const isModalOpen = isOpen && type=="messageFile"

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
         
            fileUrl: ""
        }
    })

    const handleClose= ()=>{
        form.reset();
        onClose();
    }

    const isLoading = form.formState.isSubmitting

    const onSubmit = async(values:z.infer<typeof formSchema>)=>{
        const url= qs.stringifyUrl({
            url:apiUrl || '',
            query,
        }) 

        await axios.post(url,{
            ...values,
            content:values.fileUrl
        })

        handleClose()
    }
    return (
        <Dialog 
          open={isModalOpen} 
          onOpenChange={handleClose}
        >

            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                {/* // This is header for dialog */}
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Add an attachment
                    </DialogTitle>

                    <DialogDescription className='text-center text-zinc-500'>
                       Send a file as a message                     </DialogDescription>
                </DialogHeader>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <div className="space-y-8 px-6">

                            {/* Iteam for server image */}
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                  control={form.control}
                                  name="fileUrl"
                                  render={({field}) =>(
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                                endpoint="messageFile"
                                                value ={field.value}
                                                onChange = {field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                  )}
                                />
                            </div>
                            
                        </div>

                        <DialogFooter className="bg-gray-500 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">
                               Send  
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>






                
            </DialogContent>
        </Dialog>
    )
}