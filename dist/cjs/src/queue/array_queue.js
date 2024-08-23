"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayQueue = void 0;
/**
 * An array queue is a queue that has an unbounded capacity. Reading from an array queue
 * will return the oldest element and effectively remove it from the queue.
 */
class ArrayQueue {
    constructor() {
        this.elements = [];
    }
    add(element) {
        this.elements.push(element);
    }
    clear() {
        this.elements.length = 0;
    }
    forEach(fn) {
        this.elements.forEach(fn);
    }
    length() {
        return this.elements.length;
    }
    isEmpty() {
        return this.elements.length === 0;
    }
    peek() {
        return this.elements[0];
    }
    read() {
        return this.elements.shift();
    }
}
exports.ArrayQueue = ArrayQueue;
//# sourceMappingURL=array_queue.js.map