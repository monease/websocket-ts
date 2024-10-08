import { Backoff } from "./backoff/backoff";
import { WebsocketBuffer } from "./websocket_buffer";
import { WebsocketEvent, WebsocketEventListener, WebsocketEventListenerOptions } from "./websocket_event";
import { WebsocketOptions } from "./websocket_options";
/**
 * A websocket wrapper that can be configured to reconnect automatically and buffer messages when the websocket is not connected.
 */
export declare class Websocket {
    private _url;
    private readonly _protocols?;
    private _closedByUser;
    private _lastConnection?;
    private _underlyingWebsocket;
    private retryTimeout?;
    private _options;
    /**
     * Creates a new websocket.
     *
     * @param url to connect to.
     * @param protocols optional protocols to use.
     * @param options optional options to use.
     */
    constructor(url: string, protocols?: string | string[], options?: WebsocketOptions);
    /**
     * Getter for the url.
     *
     * @return the url.
     */
    get url(): string;
    set url(url: string);
    /**
     * Getter for the protocols.
     *
     * @return the protocols, or undefined if none were provided.
     */
    get protocols(): string | string[] | undefined;
    /**
     * Getter for the buffer.
     *
     * @return the buffer, or undefined if none was provided.
     */
    get buffer(): WebsocketBuffer | undefined;
    /**
     * Getter for the maxRetries.
     *
     * @return the maxRetries, or undefined if none was provided (no limit).
     */
    get maxRetries(): number | undefined;
    /**
     * Getter for the instantReconnect.
     *
     * @return the instantReconnect, or undefined if none was provided.
     */
    get instantReconnect(): boolean | undefined;
    /**
     * Getter for the backoff.
     *
     * @return the backoff, or undefined if none was provided.
     */
    get backoff(): Backoff | undefined;
    /**
     * Whether the websocket was closed by the user. A websocket is closed by the user if the close().
     *
     * @return true if the websocket was closed by the user, false otherwise.
     */
    get closedByUser(): boolean;
    /**
     * Getter for the last 'open' event, e.g. the last time the websocket was connected.
     *
     * @return the last 'open' event, or undefined if the websocket was never connected.
     */
    get lastConnection(): Date | undefined;
    /**
     * Getter for the underlying websocket. This can be used to access the browser's native websocket directly.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
     * @return the underlying websocket.
     */
    get underlyingWebsocket(): WebSocket;
    /**
     * Getter for the readyState of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
     * @return the readyState of the underlying websocket.
     */
    get readyState(): number;
    /**
     * Getter for the bufferedAmount of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount
     * @return the bufferedAmount of the underlying websocket.
     */
    get bufferedAmount(): number;
    /**
     * Getter for the extensions of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/extensions
     * @return the extensions of the underlying websocket.
     */
    get extensions(): string;
    /**
     * Getter for the binaryType of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType
     * @return the binaryType of the underlying websocket.
     */
    get binaryType(): BinaryType;
    /**
     * Setter for the binaryType of the underlying websocket.
     *
     * @param value to set, 'blob' or 'arraybuffer'.
     */
    set binaryType(value: BinaryType);
    /**
     * Sends data over the websocket.
     *
     * If the websocket is not connected and a buffer was provided on creation, the data will be added to the buffer.
     * If no buffer was provided or the websocket was closed by the user, the data will be dropped.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     * @param data to send.
     */
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    /**
     * Close the websocket. No connection-retry will be attempted after this.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
     * @param code optional close code.
     * @param reason optional close reason.
     */
    close(code?: number, reason?: string): void;
    /**
     * Adds an event listener for the given event-type.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type of the event to add the listener for.
     * @param listener to add.
     * @param options to use when adding the listener.
     */
    addEventListener<K extends WebsocketEvent>(type: K, listener: WebsocketEventListener<K>, options?: WebsocketEventListenerOptions): void;
    /**
     * Removes one or more event listener for the given event-type that match the given listener and options.
     *
     * @param type of the event to remove the listener for.
     * @param listener to remove.
     * @param options that were used when the listener was added.
     */
    removeEventListener<K extends WebsocketEvent>(type: K, listener: WebsocketEventListener<K>, options?: WebsocketEventListenerOptions): void;
    /**
     * Creates a new browser-native websocket and connects it to the given URL with the given protocols
     * and adds all event listeners to the browser-native websocket.
     *
     * @return the created browser-native websocket which is also stored in the '_underlyingWebsocket' property.
     */
    private tryConnect;
    /**
     * Removes all event listeners from the browser-native websocket and closes it.
     */
    private clearWebsocket;
    /**
     * Handles the 'open' event of the browser-native websocket.
     * @param event to handle.
     */
    private handleOpenEvent;
    /**
     * Handles the 'error' event of the browser-native websocket.
     * @param event to handle.
     */
    private handleErrorEvent;
    /**
     * Handles the 'close' event of the browser-native websocket.
     * @param event to handle.
     */
    private handleCloseEvent;
    /**
     * Handles the 'message' event of the browser-native websocket.
     * @param event to handle.
     */
    private handleMessageEvent;
    /**
     * Dispatch an event to all listeners of the given event-type.
     *
     * @param type of the event to dispatch.
     * @param event to dispatch.
     */
    private dispatchEvent;
    /**
     * Handles the given event by dispatching it to all listeners of the given event-type.
     *
     * @param type of the event to handle.
     * @param event to handle.
     */
    private handleEvent;
    /**
     * Sends buffered data if there is a buffer defined.
     */
    private sendBufferedData;
    /**
     * Schedules a connection-retry if there is a backoff defined and the websocket was not closed by the user.
     */
    private scheduleConnectionRetryIfNeeded;
    /**
     * Cancels the scheduled connection-retry, if there is one.
     */
    private cancelScheduledConnectionRetry;
}
//# sourceMappingURL=websocket.d.ts.map