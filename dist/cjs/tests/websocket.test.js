"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const src_1 = require("../src");
const src_2 = require("../src");
describe("Testsuite for Websocket", () => {
    var _a;
    const port = process.env.PORT ? parseInt(process.env.PORT) : 41337;
    const url = (_a = process.env.URL) !== null && _a !== void 0 ? _a : `ws://localhost:${port}`;
    const serverTimeout = process.env.SERVER_TIMEOUT
        ? parseInt(process.env.SERVER_TIMEOUT)
        : 5000;
    const clientTimeout = process.env.CLIENT_TIMEOUT
        ? parseInt(process.env.CLIENT_TIMEOUT)
        : 5000;
    const testTimeout = process.env.TEST_TIMEOUT
        ? parseInt(process.env.TEST_TIMEOUT)
        : 10000;
    let client; // subject under test
    let server; // websocket server used for testing
    /** Before all tests, log the test configuration. */
    beforeAll(() => console.log(`Testing websocket on ${url}, server timeout: ${serverTimeout}ms, client timeout: ${clientTimeout}ms`));
    /** Before each test, start a websocket server on the given port. */
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield startServer(port, serverTimeout).then((s) => (server = s));
    }), testTimeout);
    /** After each test, stop the websocket server. */
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield stopClient(client, clientTimeout).then(() => (client = undefined));
        yield stopServer(server, serverTimeout).then(() => (server = undefined));
    }), testTimeout);
    describe("Getter/setter tests", () => {
        describe("Url", () => {
            test("Websocket should return the correct url", () => {
                const client = new src_1.Websocket(url);
                expect(client.url).toBe(url);
            });
        });
        describe("Protocols", () => {
            test("Websocket should return the correct protocols when protocols are a string", () => {
                const protocols = "protocol1";
                const client = new src_1.Websocket(url, protocols);
                expect(client.protocols).toEqual(protocols);
            });
            test("Websocket should return the correct protocols when protocols are an array", () => {
                const protocols = ["protocol1", "protocol2"];
                const client = new src_1.Websocket(url, protocols);
                expect(client.protocols).toEqual(protocols);
            });
            test("Websocket should return the correct protocols when protocols are undefined", () => {
                const client = new src_1.Websocket(url);
                expect(client.protocols).toBeUndefined();
            });
        });
        describe("Buffer", () => {
            test("Websocket should return the correct buffer when buffer is undefined", () => {
                const client = new src_1.Websocket(url);
                expect(client.buffer).toBeUndefined();
            });
            test("Websocket should return the correct buffer when buffer is set", () => {
                const buffer = new src_1.ArrayQueue();
                const client = new src_1.Websocket(url, undefined, { buffer });
                expect(client.buffer).toBe(buffer);
            });
        });
        describe("MaxRetries", () => {
            test("Websocket should return the correct maxRetries when maxRetries is undefined", () => {
                const client = new src_1.Websocket(url);
                expect(client.maxRetries).toBeUndefined();
            });
            test("Websocket should return the correct maxRetries when maxRetries is set", () => {
                const maxRetries = 5;
                const client = new src_1.Websocket(url, undefined, { retry: { maxRetries } });
                expect(client.maxRetries).toBe(maxRetries);
            });
        });
        describe("InstantReconnect", () => {
            test("Websocket should return the correct instantReconnect when instantReconnect is undefined", () => {
                const client = new src_1.Websocket(url);
                expect(client.instantReconnect).toBeUndefined();
            });
            test("Websocket should return the correct instantReconnect when instantReconnect is set", () => {
                const instantReconnect = true;
                const client = new src_1.Websocket(url, undefined, {
                    retry: { instantReconnect },
                });
                expect(client.instantReconnect).toBe(instantReconnect);
            });
        });
        describe("Backoff", () => {
            test("Websocket should return the correct backoff when backoff is undefined", () => {
                const client = new src_1.Websocket(url);
                expect(client.backoff).toBeUndefined();
            });
            test("Websocket should return the correct backoff when backoff is set", () => {
                const backoff = new src_1.ConstantBackoff(1000);
                const client = new src_1.Websocket(url, undefined, { retry: { backoff } });
                expect(client.backoff).toBe(backoff);
            });
        });
        describe("ClosedByUser", () => {
            test("Websocket should return false after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.closedByUser).toBe(false);
            });
            test("Websocket should return true after the client closes the connection", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance) => instance.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.closedByUser).toBe(true);
                });
            }));
            test("Websocket should return false if the server closes the connection", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen(() => server.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.closedByUser).toBe(false);
                });
            }));
        });
        describe("LastConnection", () => {
            test("Websocket should return undefined after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.lastConnection).toBeUndefined();
            });
            test("Websocket should return the correct date after the client connects to the server", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                    expect(instance.lastConnection).not.toBeUndefined();
                });
            }));
        });
        describe("UnderlyingWebsocket", () => {
            test("Websocket should return native websocket after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.underlyingWebsocket).not.toBeUndefined();
                expect(client.underlyingWebsocket).toBeInstanceOf(window.WebSocket);
            });
            test("Websocket should return the underlying websocket after the client connects to the server", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket).toBeInstanceOf(window.WebSocket);
                });
            }));
            test("Websocket should return the underlying websocket after the client closes the connection", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance) => instance.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket).toBeInstanceOf(window.WebSocket);
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
            test("Websocket should return the underlying websocket after the server closes the connection", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen(() => server.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket).toBeInstanceOf(window.WebSocket);
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
        });
        describe("ReadyState", () => {
            test("Websocket should return the correct readyState after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.readyState).toBe(ws_1.default.CONNECTING);
            });
            test("Websocket should return the correct readyState after the client connects to the server", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                    expect(instance.readyState).toBe(ws_1.default.OPEN);
                });
            }));
            test("Websocket should return the correct readyState after the client closes the connection", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance) => instance.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
        });
        describe("BufferedAmount", () => {
            test("Websocket should return the correct bufferedAmount after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.bufferedAmount).toBe(0);
            });
        });
        describe("Extensions", () => {
            test("Websocket should return the correct extensions after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.extensions).toBe("");
            });
        });
        describe("BinaryType", () => {
            test("Websocket should return the correct binaryType after initialization", () => {
                const client = new src_1.Websocket(url);
                expect(client.binaryType).toBe("blob");
            });
            test("Websocket should return the correct binaryType after setting it", () => {
                const client = new src_1.Websocket(url);
                client.binaryType = "arraybuffer";
                expect(client.binaryType).toBe("arraybuffer");
            });
        });
    });
    describe("Event tests", () => {
        describe("Open", () => {
            test("Websocket should fire 'open' when connecting to a server and the underlying websocket should be in readyState 'OPEN'", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.OPEN);
                });
            }), testTimeout);
            test("Websocket should fire 'open' when reconnecting to a server and the underlying websocket should be in readyState 'OPEN'", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .withBackoff(new src_1.ConstantBackoff(0))
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.OPEN);
                });
            }));
            test("Websocket shouldn't fire 'open' when it was removed from the event listeners", () => __awaiter(void 0, void 0, void 0, function* () {
                let timesOpenFired = 0;
                const onOpen = () => timesOpenFired++;
                const clientConnectionPromise = waitForClientToConnectToServer(server, clientTimeout);
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .withBackoff(new src_1.ConstantBackoff(100)) // try to reconnect after 100ms, 'open' should only fire once
                        .onOpen((i, ev) => {
                        timesOpenFired++;
                        resolve([i, ev]);
                    }, { once: true }) // initial 'open' event, should only fire once
                        .build();
                });
                // this resolves after the client has connected to the server, disconnect it right after
                yield clientConnectionPromise;
                expect(timesOpenFired).toBe(1);
                expect(getListenersWithOptions(client, src_2.WebsocketEvent.open)).toHaveLength(0); // since the initial listener was a 'once'-listener, this should be empty
                client.addEventListener(src_2.WebsocketEvent.open, onOpen); // add a new listener
                expect(getListenersWithOptions(client, src_2.WebsocketEvent.open)).toHaveLength(1); // since the initial listener was a 'once'-listener, this should be empty
                server === null || server === void 0 ? void 0 : server.clients.forEach((c) => c.close());
                // wait for the client to reconnect after 100ms
                yield waitForClientToConnectToServer(server, clientTimeout);
                yield new Promise((resolve) => setTimeout(resolve, 100)); // wait some extra time for client-side event to be fired
                expect(timesOpenFired).toBe(2);
                expect(getListenersWithOptions(client, src_2.WebsocketEvent.open)).toHaveLength(1); // since the initial listener was a 'once'-listener, this should be empty
                // remove the event-listener, disconnect again
                client.removeEventListener(src_2.WebsocketEvent.open, onOpen);
                expect(getListenersWithOptions(client, src_2.WebsocketEvent.open)).toHaveLength(0);
                server === null || server === void 0 ? void 0 : server.clients.forEach((c) => c.close());
                // wait for the client to reconnect after 100ms, 'open' should not fire again and timesOpenFired will still be 2
                yield waitForClientToConnectToServer(server, clientTimeout);
                yield new Promise((resolve) => setTimeout(resolve, 100));
                expect(timesOpenFired).toBe(2);
            }));
        });
        describe("Close", () => {
            test("Websocket should fire 'close' when the server closes the connection and the underlying websocket should be in readyState 'CLOSED'", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen(() => server.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.closedByUser).toBe(false);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }), testTimeout);
            test("Websocket should fire 'close' when the client closes the connection and the underlying websocket should be in readyState 'CLOSED'", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance) => instance.close())
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(instance.closedByUser).toBe(true);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
            test("Websocket should fire 'close' when the server closes the connection with a status code other than 1000 and the underlying websocket should be in readyState 'CLOSED'", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen(() => server === null || server === void 0 ? void 0 : server.clients.forEach((client) => client.close(1001, "CLOSE_GOING_AWAY")))
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(ev.code).toBe(1001);
                    expect(ev.reason).toBe("CLOSE_GOING_AWAY");
                    expect(ev.wasClean).toBe(true);
                    expect(instance.closedByUser).toBe(false);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
            test("Websocket should fire 'close' when the client closes the connection with a status code other than 1000 and the underlying websocket should be in readyState 'CLOSED'", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen((instance) => instance.close(4000, "APPLICATION_IS_SHUTTING_DOWN"))
                        .onClose((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.close);
                    expect(ev.code).toBe(4000);
                    expect(ev.reason).toBe("APPLICATION_IS_SHUTTING_DOWN");
                    expect(ev.wasClean).toBe(true);
                    expect(instance.closedByUser).toBe(true);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
        });
        describe("Error", () => {
            test("Websocket should fire 'error' when the server rejects the connection and the underlying websocket should be in readyState 'CLOSED", () => __awaiter(void 0, void 0, void 0, function* () {
                yield stopServer(server, serverTimeout).then(() => (server = undefined));
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onError((instance, ev) => resolve([instance, ev]))
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.error);
                    expect(instance.underlyingWebsocket).not.toBeUndefined();
                    expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.CLOSED);
                });
            }));
        });
        describe("Message", () => {
            test("Websocket should fire 'message' when the server sends a message", () => __awaiter(void 0, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .onOpen(() => server === null || server === void 0 ? void 0 : server.clients.forEach((client) => client.send("Hello")))
                        .onMessage((instance, ev) => {
                        expect(ev.data).toBe("Hello");
                        resolve([instance, ev]);
                    })
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.message);
                    expect(ev.data).toBe("Hello");
                });
            }));
        });
        describe("Retry & Reconnect", () => {
            test("Websocket should not emit 'retry' on the first connection attempt, emit it when retrying and emit 'reconnect' when it reconnects", () => __awaiter(void 0, void 0, void 0, function* () {
                let [openCount, retryCount, reconnectCount] = [0, 0, 0];
                const onOpen = () => openCount++;
                const onRetry = () => retryCount++;
                const onReconnect = () => reconnectCount++;
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .withBackoff(new src_1.ConstantBackoff(0)) // immediately retry
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .onOpen(onOpen)
                        .onRetry(onRetry)
                        .onReconnect(onReconnect)
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                });
                // give some time for all handlers to be called
                yield new Promise((resolve) => setTimeout(resolve, 100));
                expect(openCount).toBe(1);
                expect(retryCount).toBe(0);
                expect(reconnectCount).toBe(0);
                // disconnect all clients and give some time for the retry to happen
                server === null || server === void 0 ? void 0 : server.clients.forEach((client) => client.close());
                yield new Promise((resolve) => setTimeout(resolve, 100));
                // ws should have retried & reconnect
                expect(openCount).toBe(2);
                expect(retryCount).toBe(1);
                expect(reconnectCount).toBe(1);
            }));
        });
    });
    describe("Reconnect behaviour", () => {
        describe("InstantReconnect", () => {
            test("Websocket should try to reconnect immediately when instantReconnect is true", () => __awaiter(void 0, void 0, void 0, function* () {
                let [openCount, retryCount, reconnectCount] = [0, 0, 0];
                const onOpen = () => openCount++;
                const onRetry = () => retryCount++;
                const onReconnect = () => reconnectCount++;
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .withBackoff(new src_1.ConstantBackoff(1000)) // retry after 1 second
                        .withInstantReconnect(true) // reconnect immediately, don't wait for the backoff for the first retry
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .onOpen(onOpen)
                        .onRetry(onRetry)
                        .onReconnect(onReconnect)
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                });
                // give some time for all handlers to be called
                yield new Promise((resolve) => setTimeout(resolve, 100));
                expect(openCount).toBe(1);
                expect(retryCount).toBe(0);
                expect(reconnectCount).toBe(0);
                // disconnect all clients and give some time for the retry to happen
                server === null || server === void 0 ? void 0 : server.clients.forEach((client) => client.close());
                yield new Promise((resolve) => setTimeout(resolve, 100));
                // ws should have retried & reconnect
                expect(openCount).toBe(2);
                expect(retryCount).toBe(1);
                expect(reconnectCount).toBe(1);
            }));
            test("Websocket should not try to reconnect immediately when instantReconnect is false", () => __awaiter(void 0, void 0, void 0, function* () {
                let [openCount, retryCount, reconnectCount] = [0, 0, 0];
                const onOpen = () => openCount++;
                const onRetry = () => retryCount++;
                const onReconnect = () => reconnectCount++;
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .withBackoff(new src_1.ConstantBackoff(1000)) // retry after 1 second
                        .withInstantReconnect(false) // reconnect immediately, don't wait for the backoff for the first retry
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .onOpen(onOpen)
                        .onRetry(onRetry)
                        .onReconnect(onReconnect)
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                });
                // give some time for all handlers to be called
                yield new Promise((resolve) => setTimeout(resolve, 100));
                expect(openCount).toBe(1);
                expect(retryCount).toBe(0);
                expect(reconnectCount).toBe(0);
                // disconnect all clients and give some time for the retry to happen
                server === null || server === void 0 ? void 0 : server.clients.forEach((client) => client.close());
                yield new Promise((resolve) => setTimeout(resolve, 100));
                // ws shouldn't have retried & reconnect
                expect(openCount).toBe(1);
                expect(retryCount).toBe(0);
                expect(reconnectCount).toBe(0);
                // give some time for the retry to happen
                yield new Promise((resolve) => setTimeout(resolve, 1000));
                expect(openCount).toBe(2);
                expect(retryCount).toBe(1);
                expect(reconnectCount).toBe(1);
            }));
        });
        describe("MaxRetries", () => {
            test("Websocket should stop trying to reconnect when maxRetries is reached", () => __awaiter(void 0, void 0, void 0, function* () {
                let [openCount, retryCount, reconnectCount] = [0, 0, 0];
                const onOpen = () => openCount++;
                const onRetry = () => retryCount++;
                const onReconnect = () => reconnectCount++;
                yield new Promise((resolve) => {
                    client = new src_1.WebsocketBuilder(url)
                        .withBackoff(new src_1.ConstantBackoff(0)) // retry after 1 second
                        .withMaxRetries(5) // retry 5 times
                        .onOpen((instance, ev) => resolve([instance, ev]))
                        .onOpen(onOpen)
                        .onRetry(onRetry)
                        .onReconnect(onReconnect)
                        .build();
                }).then(([instance, ev]) => {
                    expect(instance).toBe(client);
                    expect(ev.type).toBe(src_2.WebsocketEvent.open);
                });
                // give some time for all handlers to be called
                yield new Promise((resolve) => setTimeout(resolve, 100));
                expect(openCount).toBe(1);
                expect(retryCount).toBe(0);
                expect(reconnectCount).toBe(0);
                // stop server so that the client can't reconnect
                yield stopServer(server, serverTimeout);
                yield new Promise((resolve) => setTimeout(resolve, 100));
                // ws should have retried but not reconnect
                expect(openCount).toBe(1);
                expect(retryCount).toBe(5);
                expect(reconnectCount).toBe(0);
            }));
        });
    });
    describe("Send", () => {
        test("Websocket should send a message to the server and the server should receive it", () => __awaiter(void 0, void 0, void 0, function* () {
            const serverReceivedMessage = new Promise((resolve) => {
                server === null || server === void 0 ? void 0 : server.on("connection", (client) => {
                    client === null || client === void 0 ? void 0 : client.on("message", (message) => {
                        resolve(message);
                    });
                });
            });
            yield new Promise((resolve) => {
                client = new src_1.WebsocketBuilder(url)
                    .onOpen((instance, ev) => {
                    instance.send("Hello");
                    resolve([instance, ev]);
                })
                    .build();
            }).then(([instance, ev]) => {
                expect(instance).toBe(client);
                expect(ev.type).toBe(src_2.WebsocketEvent.open);
                expect(instance.underlyingWebsocket).not.toBeUndefined();
                expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.OPEN);
            });
            yield serverReceivedMessage.then((message) => expect(message).toBe("Hello"));
        }));
        test("Websocket should send a message to the server and the server should receive it as a Uint8Array", () => __awaiter(void 0, void 0, void 0, function* () {
            const serverReceivedMessage = new Promise((resolve) => {
                server === null || server === void 0 ? void 0 : server.on("connection", (client) => {
                    client === null || client === void 0 ? void 0 : client.on("message", (message) => {
                        resolve(message);
                    });
                });
            });
            yield new Promise((resolve) => {
                client = new src_1.WebsocketBuilder(url)
                    .onOpen((instance, ev) => {
                    instance.send(new Uint8Array([1, 2, 3]));
                    resolve([instance, ev]);
                })
                    .build();
            }).then(([instance, ev]) => {
                expect(instance).toBe(client);
                expect(ev.type).toBe(src_2.WebsocketEvent.open);
                expect(instance.underlyingWebsocket).not.toBeUndefined();
                expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.OPEN);
            });
            yield serverReceivedMessage.then((message) => {
                expect(Buffer.from(message).equals(Buffer.from([1, 2, 3]))).toBe(true);
            });
        }));
        test("Websocket should buffer messages sent before the connection is open and send them when the connection is open", () => __awaiter(void 0, void 0, void 0, function* () {
            const messagesReceived = [];
            const serverReceivedMessages = new Promise((resolve) => {
                server === null || server === void 0 ? void 0 : server.on("connection", (client) => {
                    client === null || client === void 0 ? void 0 : client.on("message", (message) => {
                        messagesReceived.push(message);
                        if (messagesReceived.length === 2) {
                            resolve(messagesReceived);
                        }
                    });
                });
            });
            yield new Promise((resolve) => {
                client = new src_1.WebsocketBuilder(url)
                    .withBuffer(new src_1.ArrayQueue())
                    .onOpen((instance, ev) => {
                    setTimeout(() => {
                        instance.send("Hello2");
                        resolve([instance, ev]);
                    }, 100);
                })
                    .build();
                client.send("Hello1"); // This message should be buffered
            }).then(([instance, ev]) => {
                expect(instance).toBe(client);
                expect(ev.type).toBe(src_2.WebsocketEvent.open);
                expect(instance.underlyingWebsocket).not.toBeUndefined();
                expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.OPEN);
            });
            yield serverReceivedMessages.then((messages) => {
                expect(messages).toEqual(["Hello1", "Hello2"]);
            });
        }));
        test("Websocket send should short circuit if the websocket was closed by user", () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve) => {
                client = new src_1.WebsocketBuilder(url)
                    .onOpen((instance, ev) => resolve([instance, ev]))
                    .build();
            }).then(([instance, ev]) => {
                expect(instance).toBe(client);
                expect(ev.type).toBe(src_2.WebsocketEvent.open);
                expect(instance.underlyingWebsocket).not.toBeUndefined();
                expect(instance.underlyingWebsocket.readyState).toBe(ws_1.default.OPEN);
                // close the websocket and send a message
                instance.close();
                instance.send("This send should short circuit");
            });
        }));
    });
});
/**
 * Creates a promise that will be rejected after the given amount of milliseconds. The error will be a TimeoutError.
 * @param ms the amount of milliseconds to wait before rejecting
 * @param msg an optional message to include in the error
 */
const rejectAfter = (ms, msg) => new Promise((_, reject) => setTimeout(() => reject(msg ? new Error(`Timeout: ${msg}`) : new Error(`Timeout`)), ms));
/**
 * Stops the given websocket client.
 * @param client the websocket client to stop
 * @param timeout the amount of milliseconds to wait before rejecting
 */
const stopClient = (client, timeout) => new Promise((resolve, reject) => {
    var _a;
    if (client === undefined)
        return resolve();
    if (((_a = client.underlyingWebsocket) === null || _a === void 0 ? void 0 : _a.readyState) === ws_1.default.CLOSED)
        return resolve();
    rejectAfter(timeout, "failed to stop client").catch((err) => reject(err));
    client.addEventListener(src_2.WebsocketEvent.close, () => resolve(), {
        once: true,
    });
    client.close();
});
/**
 * Starts a websocket server on the given port.
 * @param port the port to start the server on
 * @param timeout the amount of milliseconds to wait before rejecting
 */
const startServer = (port, timeout) => new Promise((resolve, reject) => {
    rejectAfter(timeout, "failed to start server").catch((err) => reject(err));
    const wss = new ws_1.Server({ port });
    wss.on("listening", () => resolve(wss));
    wss.on("error", (err) => reject(err));
});
/**
 * Stops the given websocket server. This will terminate all connections.
 * @param wss the websocket server to stop
 * @param timeout the amount of milliseconds to wait before rejecting
 */
const stopServer = (wss, timeout) => new Promise((resolve, reject) => {
    if (wss === undefined)
        return resolve();
    rejectAfter(timeout, "failed to stop server").catch((err) => reject(err));
    wss.clients.forEach((c) => c.terminate());
    wss.addListener("close", resolve);
    wss.close();
});
/**
 * Waits for a client to connect to the given websocket server.
 *
 * @param wss the websocket server to wait for a client to connect to
 * @param timeout the amount of milliseconds to wait before rejecting
 */
const waitForClientToConnectToServer = (wss, timeout) => new Promise((resolve, reject) => {
    if (wss === undefined)
        return reject(new Error("wss is undefined"));
    rejectAfter(timeout, "failed to wait for client to connect").catch((err) => reject(err));
    wss.on("connection", (client) => resolve(client));
});
/**
 * Returns the listeners for the given event type on the given websocket client.
 *
 * @param client the websocket client to get the listeners from
 * @param type the event type to get the listeners for
 */
const getListenersWithOptions = (client, type) => { var _a; return client === undefined ? [] : (_a = client["_options"]["listeners"][type]) !== null && _a !== void 0 ? _a : []; };
//# sourceMappingURL=websocket.test.js.map