"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstace = new (ClientIO as any)(
            process.env.NEXT_PUBLIC_API_URL!,
            {
                path: "/api/socket/io",
                addTrailingSlash: false,
            }
        );

        socketInstace.on("connect", () => {
            console.log("Socket connected");
            setIsConnected(true);
        });

        socketInstace.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        socketInstace.on("connect_error", async (err: any) => {
            console.log("Socket error", err);
            //await fetch("/api/socket/io");
        });

        setSocket(socketInstace);

        return () => {
            console.log("Socket disconnecting....");
            socketInstace.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};