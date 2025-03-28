"use client"
import queryString from "query-string"
import { usePathname , 
    useRouter ,
    useSearchParams
} from 'next/navigation'
import { Video ,VideoOff } from "lucide-react"

import { ActionTooltip } from "./action-tooltip"
import { Button } from "./ui/button"
import qs from 'query-string';
import { url } from "inspector"

export const ChatVideoButton = () =>{

    const pathname = usePathname()
    const router = useRouter()
    const serachParams = useSearchParams();

    const isVideo = serachParams?.get("video")
    const Icon = isVideo ? VideoOff :Video
    const tooltipLabel = isVideo ?"End Video call ":"Start video call"

    const onClick =()=>{
        const url = qs.stringifyUrl({
            url:pathname|| "",
            query:{
                video:isVideo ?undefined :true
            }
        },{skipNull:true})

        router.push(url)
    }

    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} 
              className="hover:opacity-75 transition mr-4 "
            >
                <Icon className="h-6 w-6 text-zinc-500 
                 darK;text-zinc-400"/>
            </button>

        </ActionTooltip>
    )
}