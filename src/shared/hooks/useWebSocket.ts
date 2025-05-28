import { WebSocketService } from '@box/shared/services';
import { useEffect, useRef } from 'react';

export function useWebSocket(
  connectionUrl: string,
  onMessage: (ev: MessageEvent) => void,
  onOpen: (ev: Event) => void,
  onClose: (callback: CloseEvent) => void,
  onError: (ev: Event) => void,
) {

  const socketRef = useRef<WebSocketService>();

  const closeConnection = () => {
    socketRef.current?.close();
  };

  const sendMessage = (msg: string) => {
    socketRef.current?.send(msg);
  };
  
  useEffect(() => {
    if (!socketRef.current) socketRef.current = new WebSocketService({ connectionUrl });
    socketRef.current.onOpen(onOpen);
    socketRef.current.onClose(onClose);
    socketRef.current.onError(onError);
    socketRef.current.onMessage(onMessage);

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return { closeConnection, sendMessage };
}
