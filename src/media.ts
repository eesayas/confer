export class MediaManager {
  static #instance;
  #stream: MediaStream;
  #ready: boolean = false;

  constructor() {
    if (MediaManager.#instance) {
      return MediaManager.#instance;
    }
    MediaManager.#instance = this;

    this.#setup();
  }

  async #setup() {
    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      this.#ready = true;
    } catch (err) {
      throw Error("problem with getting local video & audio");
    }
  }

  get stream() {
    return this.#stream;
  }

  get ready() {
    return this.#ready;
  }

  toggleVideo = () => {
    const [video] = this.#stream.getVideoTracks();
    video.enabled = !video.enabled;
  };

  toggleAudio = () => {
    const [audio] = this.#stream.getAudioTracks();
    audio.enabled = !audio.enabled;
  };
}
