export {};

declare global {
    interface Window {
        ipcRenderer: {
            send: (channel: string, ...args: unknown[]) => void;
            invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
            on: (channel: string, listener: (event: Event, ...args: unknown[]) => void) => void;
            removeListener: (channel: string, listener: (...args: unknown[]) => void) => void;
        };
    }
}
