import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function usePrivateChatWebSocket(toSetMessage) {
  const [privateChatSocket, setPrivateChatSocket] = useState(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (typeof toSetMessage !== "function") {
      console.error("toSetMessage must be a function");
      return;
    }

    const ws = new WebSocket("wss://localhost:8080/api/ws/user");

    ws.onopen = () => {
      console.log("Websocket initialized for private chat");
      const initWsObject = {
        type: "init",
        sender_uuid: Cookies.get("Token"),
      };
      ws.send(JSON.stringify(initWsObject));
    };

    ws.onmessage = (event) => {
      toSetMessage(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error for private chat:", error);
      if (error?.target && error.target.readyState === WebSocket.CLOSED) {
        console.error("WebSocket connection closed unexpectedly:", error);
      } else {
        console.error("WebSocket error observed:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed for private chat.");
    };

    setPrivateChatSocket(ws);
    return () => {
      console.log("Closing socket for private chat");
      ws.close();
    };
  }, []);

  return privateChatSocket;
}

export default usePrivateChatWebSocket;