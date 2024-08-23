"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantBackoff = void 0;
/**
 * ConstantBackoff always returns the same backoff-time.
 */
class ConstantBackoff {
    /**
     * Creates a new ConstantBackoff.
     * @param backoff the backoff-time to return
     */
    constructor(backoff) {
        this._retries = 0;
        if (!Number.isInteger(backoff) || backoff < 0) {
            throw new Error("Backoff must be a positive integer");
        }
        this.backoff = backoff;
    }
    get retries() {
        return this._retries;
    }
    get current() {
        return this.backoff;
    }
    next() {
        this._retries++;
        return this.backoff;
    }
    reset() {
        this._retries = 0;
    }
}
exports.ConstantBackoff = ConstantBackoff;
//# sourceMappingURL=constantbackoff.js.map