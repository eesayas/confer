import { MediaManager } from "./media";
import { Socket } from "./socket";
import { EventHandler, waitUntil } from "./utils";

const config: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.classie.ca:5349" },
    {
      urls: "turn:turn.classie.ca:3478?transport=tcp",
      username: "confer",
      credential: "conference",
    },
  ],
};
const socket = new Socket();

interface RTCPayload {
  id: string;
  rtc: RTCSessionDescriptionInit;
}

interface ICEPayload {
  id: string;
  ice: RTCIceCandidate;
}

export class PeerManager extends EventHandler {
  static #instance;
  #peers: Record<string, Peer> = {};

  constructor() {
    super();

    if (PeerManager.#instance) {
      return PeerManager.#instance;
    }
    PeerManager.#instance = this;
  }

  add(peer: Peer) {
    this.#peers[peer.id] = peer;
    this.trigger("update");
  }

  remove(id: string) {
    delete this.#peers[id];
    this.trigger("update");
  }

  get peers() {
    return Object.values(this.#peers);
  }
}

export class Peer extends EventHandler {
  readonly #pc: RTCPeerConnection;
  readonly #socket: Socket;

  // The unique id of the remote peer
  readonly id: string;

  constructor(id: string, offer?: RTCSessionDescriptionInit) {
    super();

    this.#pc = new RTCPeerConnection(config);
    this.#socket = socket;

    // Remote client
    this.id = id;

    // Wait until Media Manager stream is available
    const mediaManager = new MediaManager();
    waitUntil(() => mediaManager.ready).then(() => {
      const stream = mediaManager.stream;
      const tracks = stream.getTracks();
      this.addTracks(tracks, stream);

      if (offer) {
        this.#receiveOffer(offer);
      } else {
        this.#sendOffer();

        // Listen to answer for offer
        this.#listenForAnswer();
      }
    });

    // Add to newly created peer to manager
    const peerManager = new PeerManager();
    peerManager.add(this);

    // Listen for local ICE
    this.#pc.addEventListener("icecandidate", ({ candidate }) => {
      console.log("local ice candidate");
      if (candidate) {
        this.#socket.send("ICE", {
          id: this.id,
          ice: candidate,
        });
      }
    });

    // Listen for remote ICE
    this.#socket.on("ICE", async (data: ICEPayload) => {
      console.log("remote ice candidate", data);
      if (data.id === this.id) {
        try {
          await this.#pc.addIceCandidate(data.ice);
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    });

    this.#pc.addEventListener("connectionstatechange", (event) => {
      console.log("connection", event, this.#pc.connectionState);
      if (this.#pc.connectionState === "connected") {
        console.log("Peer connection successful:", this.id);
      }
    });

    this.#pc.addEventListener("track", async (event) => {
      const [remoteStream] = event.streams;
      this.trigger("track", remoteStream);
    });
  }

  async #receiveOffer(offer: RTCSessionDescriptionInit) {
    this.#pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.#pc.createAnswer();
    this.#pc.setLocalDescription(answer);

    console.log("complete!");

    this.#socket.send("ANSWER", {
      id: this.id,
      rtc: answer,
    });
  }
  async #sendOffer() {
    const offer = await this.#pc.createOffer();
    await this.#pc.setLocalDescription(offer);

    this.#socket.send("OFFER", {
      id: this.id,
      rtc: offer,
    });
  }

  async #listenForAnswer() {
    this.#socket.on("ANSWER", async (data: RTCPayload) => {
      if (data.id === this.id) {
        await this.#pc.setRemoteDescription(
          new RTCSessionDescription(data.rtc)
        );
      }
    });
  }

  addTracks(tracks: MediaStreamTrack[], stream: MediaStream) {
    for (const track of tracks) {
      this.#pc.addTrack(track, stream);
    }
  }
}

waitUntil(() => socket.ready).then(() => {
  // The id of the new peer
  socket.on("NEW", (id: string) => {
    console.log("old peer");
    new Peer(id);
  });

  // Upon receiving offer, create a new peer
  socket.on("OFFER", (data: RTCPayload) => {
    console.log("new peer");
    new Peer(data.id, data.rtc);
  });

  socket.on("LEFT", (id: string) => {
    const peerManager = new PeerManager();
    peerManager.remove(id);
  });
});
