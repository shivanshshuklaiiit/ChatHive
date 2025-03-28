import { NextApiRequest } from 'next';
import { NextApiResponseIo } from '@/types';
import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { error } from 'console';
import { MemeberRole, Profile } from '@prisma/client';
import { currentProfile } from '../../../../lib/current-profile';

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseIo
){
    if(req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({error:"Method not allowed"})
    }

    try{
        const profile = await currentProfilePages(req);
        const { directMessageId ,conversationId }= req.query;
        const {content }= req.body 

        if(!profile){
            res.status(401).json({error:"Unauthorized"})
        }

        if(!conversationId){
            res.status(400).json({error:"conversationId missign"})
        }

        const conversation = await db.conversation.findFirst({
           where:{
            id:conversationId as string ,
            OR:[
                {
                    memberOne:{
                       profileId:profile?.id
                    }
                },
                {
                    memberTwo:{
                        profileId:profile?.id
                    }
                }
                
            ]
           },
           include:{
            memberOne:{
                include:{
                    profile:true
                }
            },
            memberTwo:{
                include:{
                    profile:true
                }
            }
           }
        })

        if(!conversation){
            return res.status(404).json({
                message:"conversation not found "
            })
        }

        const member = conversation.memberOne.profileId === profile?.id ? 
            conversation.memberOne : conversation.memberTwo
        if(!member){
            return res.status(404).json({error:"channel not found "})
        }

        let directMessage = await db.directMessage.findFirst({
            where:{
                id:directMessageId as string ,
                conversationId:conversationId as string 
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if(!directMessage || directMessage.deleted){
            return res.status(404).json({error:"message not found "})
        }

        const isMessageOwner = directMessage.memberId === member.id ;

        const isAdmin = member.role === MemeberRole.ADMIN;
        const isModerator = member.role === MemeberRole.MODERATOR;

        const canModify = isMessageOwner || isAdmin || isModerator;

        if(!canModify){
            return res.status(401).json({error:"Unauthorized "})
        }

        if(req.method ==="DELETE"){
            directMessage = await db.directMessage.update({
                where:{
                    id:directMessageId as string 
                },
                data:{
                   fileUrl:null,
                   content:'this message has been deleted ' 
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }

        if(req.method ==="PATCH"){

            if(!isMessageOwner){
                return res.status(401).json({error:"unauthorized"})
            }
            directMessage = await db.directMessage.update({
                where:{
                    id:directMessageId as string 
                },
                data:{
                   content 
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${conversation.id}:messages:update`

        res?.socket?.server?.io?.emit(updateKey,directMessage)
        return res.status(200).json(directMessage)



    }catch(error){
        console.log("[MESSAGE_ID]",error)
        return res.status(500).json({error:"Internal error"})

    }
}