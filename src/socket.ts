const SOCKET_URL = import.meta.env.DEV
  ? "ws://localhost:8000"
  : window.location.origin.replace(/^https/, "wss");

export class Socket {
  static #instance;
  #socket: WebSocket;
  #eventHandlers: Record<string, ((data?: any) => void)[]> = {};
  #ready: boolean = false;

  constructor() {
    if (Socket.#instance) {
      return Socket.#instance;
    }
    Socket.#instance = this;

    this.#socket = new WebSocket(SOCKET_URL);

    this.#socket.addEventListener("open", () => {
      this.#ready = true;
    });

    this.#socket.addEventListener("message", (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data);
        this.trigger(eventName, data);
      } catch (err) {
        console.error("Invalid message received:", event.data, err);
      }
    });
  }

  send(event: string, data?: any) {
    this.#socket.send(JSON.stringify({ event, data }));
  }

  on(event: string, handler: (data?: any) => void) {
    if (!this.#eventHandlers[event]) {
      this.#eventHandlers[event] = [];
    }
    this.#eventHandlers[event].push(handler);
  }

  private trigger(event: string, data?: any) {
    if (this.#eventHandlers[event]) {
      for (const handler of this.#eventHandlers[event]) {
        // Invoke handler
        handler(data);
      }
    }
  }

  get ready() {
    return this.#ready;
  }
}
