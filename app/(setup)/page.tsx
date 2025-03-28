import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
const SetupPage = async () => {
    const profile = await initialProfile();

    // okay we will find first server to which 
    // profile is memeber 
    const server = await db.server.findFirst({
        where:{
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })

    // if we find such server we will rediret user to that 
    if(server){
        return redirect(`/servers/${server.id}`)
    }

    //if no server found 
    // we will show ui to crete server
    // return <InitialModal/>

    return <div>
        <InitialModal/>
    </div>


}
 
export default SetupPage;