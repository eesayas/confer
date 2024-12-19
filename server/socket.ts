export class Server {
  response: Response;
  socket: Socket;

  constructor(request: Request) {
    const { response, socket } = Deno.upgradeWebSocket(request);
    this.response = response;
    this.socket = new Socket(socket);
  }
}

const rooms: Record<string, WebSocket[]> = {};
const clients: Record<string, WebSocket> = {};

class Socket {
  socket: WebSocket;
  client: string;

  // For cleanup
  #rooms: string[] = [];

  #eventHandlers: Record<string, ((data?: any) => void)[]> = {};

  constructor(socket: WebSocket) {
    this.socket = socket;
    this.client = crypto.randomUUID();

    // Register client's socket
    socket.addEventListener("open", () => {
      clients[this.client] = socket;
    });

    // Listen to incoming messages
    socket.addEventListener("message", (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data);
        this.trigger(eventName, data);
      } catch (err) {
        console.error("Invalid message received:", event.data, err);
      }
    });

    // Cleanup
    socket.addEventListener("close", () => {
      // For clients var
      delete clients[this.client];

      // For rooms var
      for (const key of this.#rooms) {
        if (rooms[key]) {
          rooms[key] = rooms[key].filter((socket) => socket !== this.socket);

          // No more peers in room
          if (rooms[key].length === 0) {
            delete rooms[key];
          }
        }
      }
    });
  }

  /**
   * Join a room
   * @param key - room key
   */
  join(key: string) {
    // For cleanup
    this.#rooms.push(key);

    if (!rooms[key]) {
      rooms[key] = [];
    }
    rooms[key].push(this.socket);
  }

  /**
   * Recipient id can be room or individual client
   * @param id
   * @returns send function
   */
  to(id: string) {
    let peers: WebSocket[] = [];

    // Find room or individual client
    if (rooms[id]) {
      peers = peers.concat(rooms[id].filter((peer) => peer !== this.socket));
    } else if (clients[id]) {
      peers.push(clients[id]);
    }

    return {
      send: (event: string, data?: any) => {
        for (const peer of peers) {
          peer.send(JSON.stringify({ event, data }));
        }

        return peers;
      },
    };
  }

  /**
   * Listen to events
   * @param event
   * @param handler
   */
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
}
