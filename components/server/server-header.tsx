"use client";
import { ServerWithMembersWithProfiles } from '@/types';
import { MemeberRole } from '@prisma/client';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, User, UserPlus } from "lucide-react";
import { useModal } from '@/hooks/use-model-state';



interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemeberRole
}


function ServerHeader(
    {
        server,
        role
    }: ServerHeaderProps
) {

    const isAdmin = role === MemeberRole.ADMIN
    const isModerator =isAdmin || role===MemeberRole.MODERATOR
    const {onOpen}=useModal()
    
    return (
        <DropdownMenu>

            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button
                  className="w-full text-md font-semibold px-3 flex
                  items-center h-12 border-neutral-200 dark:border-neutral-800
                  border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>

            </DropdownMenuTrigger>


            <DropdownMenuContent
              className="w-56 text-xs font-medium text-black
              dark:text-neutral-400 space-y-[2px]"
            >
                {isModerator &&(
                    <DropdownMenuItem
                        onClick={()=>onOpen("invite", {server})}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >   
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )
                }

                {isAdmin &&(
                    <DropdownMenuItem
                    onClick={()=>onOpen("editServer",{server})}
                        className=" px-3 py-2 text-sm cursor-pointer"
                    >   
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )
                }

                {isAdmin &&(
                    <DropdownMenuItem
                        className=" px-3 py-2 text-sm cursor-pointer"
                        onClick={()=>onOpen("members",{server})}
                    >   
                        Manage Members
                        <User className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )
                }

                {isModerator &&(
                    <DropdownMenuItem
                        onClick={()=>onOpen("createChannel")}
                        className=" px-3 py-2 text-sm cursor-pointer"
                    >   
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )
                }
                {isModerator && (
                    <DropdownMenuSeparator/>
                )
                }

                {isAdmin &&(
                    <DropdownMenuItem
                        onClick={()=>onOpen("deleteServer",{server})}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >   
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )
                }
                

                {!isAdmin &&(
                    <DropdownMenuItem
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                        onClick={()=>onOpen("leaveServer",{server})}
                    >   
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )
                }

            </DropdownMenuContent>


        </DropdownMenu>
        
    )
}

export default ServerHeader


