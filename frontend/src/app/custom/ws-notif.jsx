import { useState, useEffect } from 'react';

function useNotifWebSocket() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('wss://localhost:8080/api/ws/notifs');
        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return socket;
}

export default useNotifWebSocket;