type Listener<T> = (payload: T) => void;

export class EventBus<Events extends object> {
  private listeners: {
    [K in keyof Events]?: Array<Listener<Events[K]>>;
  } = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    const list = this.listeners[event];
    if (list) {
      list.push(listener);
    } else {
      this.listeners[event] = [listener];
    }
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    const list = this.listeners[event];
    if (!list) return;

    this.listeners[event] = list.filter((l) => l !== listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners[event]?.forEach((listener) => listener(payload));
  }

  clear() {
    this.listeners = {};
  }
}
