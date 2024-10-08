var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebsocketEvent, } from "./websocket_event";
/**
 * A websocket wrapper that can be configured to reconnect automatically and buffer messages when the websocket is not connected.
 */
export class Websocket {
    /**
     * Creates a new websocket.
     *
     * @param url to connect to.
     * @param protocols optional protocols to use.
     * @param options optional options to use.
     */
    constructor(url, protocols, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        this._closedByUser = false; // whether the websocket was closed by the user
        /**
         * Handles the 'open' event of the browser-native websocket.
         * @param event to handle.
         */
        this.handleOpenEvent = (event) => this.handleEvent(WebsocketEvent.open, event);
        /**
         * Handles the 'error' event of the browser-native websocket.
         * @param event to handle.
         */
        this.handleErrorEvent = (event) => this.handleEvent(WebsocketEvent.error, event);
        /**
         * Handles the 'close' event of the browser-native websocket.
         * @param event to handle.
         */
        this.handleCloseEvent = (event) => this.handleEvent(WebsocketEvent.close, event);
        /**
         * Handles the 'message' event of the browser-native websocket.
         * @param event to handle.
         */
        this.handleMessageEvent = (event) => this.handleEvent(WebsocketEvent.message, event);
        this._url = url;
        this._protocols = protocols;
        // make a copy of the options to prevent the user from changing them
        this._options = {
            buffer: options === null || options === void 0 ? void 0 : options.buffer,
            retry: {
                maxRetries: (_a = options === null || options === void 0 ? void 0 : options.retry) === null || _a === void 0 ? void 0 : _a.maxRetries,
                instantReconnect: (_b = options === null || options === void 0 ? void 0 : options.retry) === null || _b === void 0 ? void 0 : _b.instantReconnect,
                backoff: (_c = options === null || options === void 0 ? void 0 : options.retry) === null || _c === void 0 ? void 0 : _c.backoff,
            },
            listeners: {
                open: [...((_e = (_d = options === null || options === void 0 ? void 0 : options.listeners) === null || _d === void 0 ? void 0 : _d.open) !== null && _e !== void 0 ? _e : [])],
                close: [...((_g = (_f = options === null || options === void 0 ? void 0 : options.listeners) === null || _f === void 0 ? void 0 : _f.close) !== null && _g !== void 0 ? _g : [])],
                error: [...((_j = (_h = options === null || options === void 0 ? void 0 : options.listeners) === null || _h === void 0 ? void 0 : _h.error) !== null && _j !== void 0 ? _j : [])],
                message: [...((_l = (_k = options === null || options === void 0 ? void 0 : options.listeners) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : [])],
                retry: [...((_o = (_m = options === null || options === void 0 ? void 0 : options.listeners) === null || _m === void 0 ? void 0 : _m.retry) !== null && _o !== void 0 ? _o : [])],
                reconnect: [...((_q = (_p = options === null || options === void 0 ? void 0 : options.listeners) === null || _p === void 0 ? void 0 : _p.reconnect) !== null && _q !== void 0 ? _q : [])],
            },
        };
        this._underlyingWebsocket = this.tryConnect();
    }
    /**
     * Getter for the url.
     *
     * @return the url.
     */
    get url() {
        return this._url;
    }
    set url(url) {
        this._url = url;
    }
    /**
     * Getter for the protocols.
     *
     * @return the protocols, or undefined if none were provided.
     */
    get protocols() {
        return this._protocols;
    }
    /**
     * Getter for the buffer.
     *
     * @return the buffer, or undefined if none was provided.
     */
    get buffer() {
        return this._options.buffer;
    }
    /**
     * Getter for the maxRetries.
     *
     * @return the maxRetries, or undefined if none was provided (no limit).
     */
    get maxRetries() {
        return this._options.retry.maxRetries;
    }
    /**
     * Getter for the instantReconnect.
     *
     * @return the instantReconnect, or undefined if none was provided.
     */
    get instantReconnect() {
        return this._options.retry.instantReconnect;
    }
    /**
     * Getter for the backoff.
     *
     * @return the backoff, or undefined if none was provided.
     */
    get backoff() {
        return this._options.retry.backoff;
    }
    /**
     * Whether the websocket was closed by the user. A websocket is closed by the user if the close().
     *
     * @return true if the websocket was closed by the user, false otherwise.
     */
    get closedByUser() {
        return this._closedByUser;
    }
    /**
     * Getter for the last 'open' event, e.g. the last time the websocket was connected.
     *
     * @return the last 'open' event, or undefined if the websocket was never connected.
     */
    get lastConnection() {
        return this._lastConnection;
    }
    /**
     * Getter for the underlying websocket. This can be used to access the browser's native websocket directly.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
     * @return the underlying websocket.
     */
    get underlyingWebsocket() {
        return this._underlyingWebsocket;
    }
    /**
     * Getter for the readyState of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
     * @return the readyState of the underlying websocket.
     */
    get readyState() {
        return this._underlyingWebsocket.readyState;
    }
    /**
     * Getter for the bufferedAmount of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount
     * @return the bufferedAmount of the underlying websocket.
     */
    get bufferedAmount() {
        return this._underlyingWebsocket.bufferedAmount;
    }
    /**
     * Getter for the extensions of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/extensions
     * @return the extensions of the underlying websocket.
     */
    get extensions() {
        return this._underlyingWebsocket.extensions;
    }
    /**
     * Getter for the binaryType of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType
     * @return the binaryType of the underlying websocket.
     */
    get binaryType() {
        return this._underlyingWebsocket.binaryType;
    }
    /**
     * Setter for the binaryType of the underlying websocket.
     *
     * @param value to set, 'blob' or 'arraybuffer'.
     */
    set binaryType(value) {
        this._underlyingWebsocket.binaryType = value;
    }
    /**
     * Sends data over the websocket.
     *
     * If the websocket is not connected and a buffer was provided on creation, the data will be added to the buffer.
     * If no buffer was provided or the websocket was closed by the user, the data will be dropped.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     * @param data to send.
     */
    send(data) {
        if (this.closedByUser)
            return; // no-op if closed by user
        if (this._underlyingWebsocket.readyState === this._underlyingWebsocket.OPEN) {
            this._underlyingWebsocket.send(data); // websocket is connected, send data
        }
        else if (this.buffer !== undefined) {
            this.buffer.add(data); // websocket is not connected, add data to buffer
        }
    }
    /**
     * Close the websocket. No connection-retry will be attempted after this.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
     * @param code optional close code.
     * @param reason optional close reason.
     */
    close(code, reason) {
        this.cancelScheduledConnectionRetry(); // cancel any scheduled retries
        this._closedByUser = true; // mark websocket as closed by user
        this._underlyingWebsocket.close(code, reason); // close underlying websocket with provided code and reason
    }
    /**
     * Adds an event listener for the given event-type.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type of the event to add the listener for.
     * @param listener to add.
     * @param options to use when adding the listener.
     */
    addEventListener(type, listener, options) {
        this._options.listeners[type].push({ listener, options }); // add listener to list of listeners
    }
    /**
     * Removes one or more event listener for the given event-type that match the given listener and options.
     *
     * @param type of the event to remove the listener for.
     * @param listener to remove.
     * @param options that were used when the listener was added.
     */
    removeEventListener(type, listener, options) {
        const isListenerNotToBeRemoved = (l) => l.listener !== listener || l.options !== options;
        this._options.listeners[type] =
            this._options.listeners[type].filter(isListenerNotToBeRemoved); // only keep listeners that are not to be removed
    }
    /**
     * Creates a new browser-native websocket and connects it to the given URL with the given protocols
     * and adds all event listeners to the browser-native websocket.
     *
     * @return the created browser-native websocket which is also stored in the '_underlyingWebsocket' property.
     */
    tryConnect() {
        this._underlyingWebsocket = new WebSocket(this.url, this.protocols); // create new browser-native websocket and add all event listeners
        this._underlyingWebsocket.addEventListener(WebsocketEvent.open, this.handleOpenEvent);
        this._underlyingWebsocket.addEventListener(WebsocketEvent.close, this.handleCloseEvent);
        this._underlyingWebsocket.addEventListener(WebsocketEvent.error, this.handleErrorEvent);
        this._underlyingWebsocket.addEventListener(WebsocketEvent.message, this.handleMessageEvent);
        return this._underlyingWebsocket;
    }
    /**
     * Removes all event listeners from the browser-native websocket and closes it.
     */
    clearWebsocket() {
        this._underlyingWebsocket.removeEventListener(WebsocketEvent.open, this.handleOpenEvent);
        this._underlyingWebsocket.removeEventListener(WebsocketEvent.close, this.handleCloseEvent);
        this._underlyingWebsocket.removeEventListener(WebsocketEvent.error, this.handleErrorEvent);
        this._underlyingWebsocket.removeEventListener(WebsocketEvent.message, this.handleMessageEvent);
        this._underlyingWebsocket.close();
    }
    /**
     * Dispatch an event to all listeners of the given event-type.
     *
     * @param type of the event to dispatch.
     * @param event to dispatch.
     */
    dispatchEvent(type, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventListeners = this._options.listeners[type];
            const newEventListeners = [];
            yield Promise.all(eventListeners.map((_a) => __awaiter(this, [_a], void 0, function* ({ listener, options }) {
                if (listener.constructor.name === "AsyncFunction") {
                    yield listener(this, event); // invoke listener with event
                }
                else {
                    listener(this, event); // invoke listener with event
                }
                if (options === undefined ||
                    options.once === undefined ||
                    !options.once) {
                    newEventListeners.push({ listener, options }); // only keep listener if it isn't a once-listener
                }
            })));
            this._options.listeners[type] = newEventListeners; // replace old listeners with new listeners that don't include once-listeners
        });
    }
    /**
     * Handles the given event by dispatching it to all listeners of the given event-type.
     *
     * @param type of the event to handle.
     * @param event to handle.
     */
    handleEvent(type, event) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case WebsocketEvent.close:
                    yield this.dispatchEvent(type, event);
                    this.scheduleConnectionRetryIfNeeded(); // schedule a new connection retry if the websocket was closed by the server
                    break;
                case WebsocketEvent.open:
                    if (this.backoff !== undefined && this._lastConnection !== undefined) {
                        // websocket was reconnected, dispatch reconnect event and reset backoff
                        const detail = {
                            retries: this.backoff.retries,
                            lastConnection: new Date(this._lastConnection),
                        };
                        const event = new CustomEvent(WebsocketEvent.reconnect, {
                            detail,
                        });
                        yield this.dispatchEvent(WebsocketEvent.reconnect, event);
                        this.backoff.reset();
                    }
                    this._lastConnection = new Date();
                    yield this.dispatchEvent(type, event); // dispatch open event and send buffered data
                    this.sendBufferedData();
                    break;
                case WebsocketEvent.retry:
                    yield this.dispatchEvent(type, event); // dispatch retry event and try to connect
                    this.clearWebsocket(); // clear the old websocket
                    this.tryConnect();
                    break;
                default:
                    yield this.dispatchEvent(type, event); // dispatch event to all listeners of the given event-type
                    break;
            }
        });
    }
    /**
     * Sends buffered data if there is a buffer defined.
     */
    sendBufferedData() {
        if (this.buffer === undefined) {
            return; // no buffer defined, nothing to send
        }
        for (let ele = this.buffer.read(); ele !== undefined; ele = this.buffer.read()) {
            this.send(ele); // send buffered data
        }
    }
    /**
     * Schedules a connection-retry if there is a backoff defined and the websocket was not closed by the user.
     */
    scheduleConnectionRetryIfNeeded() {
        if (this.closedByUser) {
            return; // user closed the websocket, no retry
        }
        if (this.backoff === undefined) {
            return; // no backoff defined, no retry
        }
        // handler dispatches the retry event to all listeners of the retry event-type
        const handleRetryEvent = (detail) => {
            const event = new CustomEvent(WebsocketEvent.retry, { detail });
            this.handleEvent(WebsocketEvent.retry, event);
        };
        // create retry event detail, depending on the 'instantReconnect' option
        const retryEventDetail = {
            backoff: this._options.retry.instantReconnect === true ? 0 : this.backoff.next(),
            retries: this._options.retry.instantReconnect === true
                ? 0
                : this.backoff.retries,
            lastConnection: this._lastConnection,
        };
        // schedule a new connection-retry if the maximum number of retries is not reached yet
        if (this._options.retry.maxRetries === undefined ||
            retryEventDetail.retries <= this._options.retry.maxRetries) {
            this.retryTimeout = globalThis.setTimeout(() => handleRetryEvent(retryEventDetail), retryEventDetail.backoff);
        }
    }
    /**
     * Cancels the scheduled connection-retry, if there is one.
     */
    cancelScheduledConnectionRetry() {
        globalThis.clearTimeout(this.retryTimeout);
    }
}
//# sourceMappingURL=websocket.js.map