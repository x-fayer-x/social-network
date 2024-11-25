import { useState, useEffect } from "react";

function useGroupChatWebSocket(toSetMessage) {
    const [groupChatSocket, setGroupChatSocket] = useState(null);

    if (typeof toSetMessage !== "function") {
        console.error("toSetMessage must be a function");
        return;
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const ws = new WebSocket("wss://localhost:8080/api/ws/group");

        
        setGroupChatSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return groupChatSocket;
}

export default useGroupChatWebSocket;