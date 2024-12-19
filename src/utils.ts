export const waitUntil = (conditionFn, interval = 100) => {
  return new Promise<void>((resolve) => {
    const check = setInterval(() => {
      if (conditionFn()) {
        clearInterval(check);
        resolve();
      }
    }, interval);
  });
};

export class EventHandler {
  #eventHandlers: Record<string, (data?: any) => void> = {};

  on(event: string, handler: (data?: any) => void): void {
    this.#eventHandlers[event] = handler;
  }

  protected trigger(event: string, data?: any): void {
    const handler = this.#eventHandlers[event];
    handler && handler(data);
  }
}
