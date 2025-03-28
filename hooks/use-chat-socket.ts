import { useSocket } from "@/components/providers/socket-provider"
import { Member, Message, Profile } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface QueryData {
    pages: Array<{
        items: MessageWithMemberWithProfile[];
    }>;
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    const { socket } = useSocket()
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            try {
                queryClient.setQueryData<QueryData>([queryKey], (oldData) => {
                    if (!oldData || !oldData.pages || !Array.isArray(oldData.pages) || oldData.pages.length === 0) {
                        return oldData;
                    }

                    const newData = oldData.pages.map((page) => {
                        if (!page || !Array.isArray(page.items)) {
                            return page;
                        }

                        return {
                            ...page,
                            items: page.items.map((item) => {
                                if (item.id === message.id) {
                                    return message;
                                }
                                return item;
                            })
                        };
                    });

                    return {
                        ...oldData,
                        pages: newData
                    };
                });
            } catch (error) {
                console.error("Error updating query data:", error);
            }
        });

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            try {
                queryClient.setQueryData<QueryData>([queryKey], (oldData) => {
                    if (!oldData || !oldData.pages || !Array.isArray(oldData.pages) || oldData.pages.length === 0) {
                        return {
                            pages: [{
                                items: [message]
                            }]
                        };
                    }

                    const newData = [...oldData.pages];
                    newData[0] = {
                        ...newData[0],
                        items: [
                            message,
                            ...newData[0].items
                        ]
                    };

                    return {
                        ...oldData,
                        pages: newData
                    };
                });
            } catch (error) {
                console.error("Error adding new message:", error);
            }
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [queryClient, addKey, queryKey, updateKey, socket]);
}