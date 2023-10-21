import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { SocketEventHandlers } from "../components/types";

/**
 * Handles the connection and disconnection from socket io.
 */
const useSocket = (url: string, eventHandlers: SocketEventHandlers = {}) => {
  const socket = useMemo(() => {
    return io(url, {
      autoConnect: false
    })
  }, [url]);

  useEffect(() => {
    console.log('connecting to websocket:', url);
    socket.connect();

    const cleanup = () => {
      console.log('disconnecting from websocket:', url);
      socket.disconnect();
    }
    return cleanup;
  }, [socket, url]);

  useEffect(() => {
    for (const event of Object.keys(eventHandlers)) {
      socket.on(event, eventHandlers[event]);
    }

    const cleanup = () => {
      for (const event of Object.keys(eventHandlers)) {
        socket.off(event, eventHandlers[event]);
      }
    }
    return cleanup;
  }, [socket, eventHandlers]);

  return socket;
}

export default useSocket;
