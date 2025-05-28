import { IWebsocketService } from '@box/shared/services/websocket/types';

export class WebSocketService {
  constructor(props: IWebsocketService) {
    this.connectionUrl = props.connectionUrl;
    this.webSocket = new WebSocket(this.connectionUrl);
  }

  private readonly connectionUrl: string;

  private readonly webSocket: WebSocket;

  send(message: string) {
    this.webSocket.send(message);
  }

  close() {
    this.webSocket.close();
  }

  static parseJsonData(jsonData: string) {
    return JSON.parse(JSON.parse(jsonData));
  }

  onOpen(callback: (ev: Event) => void) {
    this.webSocket.onopen = callback;
  }

  onMessage(callback: (ev: MessageEvent) => void) {
    this.webSocket.onmessage = callback;
  }

  onClose(callback: (ev: CloseEvent) => void) {
    this.webSocket.onclose = callback;
  }

  onError(callback: (ev: Event) => void) {
    this.webSocket.onerror = callback;
  }
}
