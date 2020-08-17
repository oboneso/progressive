"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_listener_1 = require("@gamestdio/state-listener");
var fossilDelta = __importStar(require("fossil-delta"));
var msgpack = __importStar(require("../msgpack"));
var FossilDeltaSerializer = /** @class */ (function () {
    function FossilDeltaSerializer() {
        this.api = new state_listener_1.StateContainer({});
    }
    FossilDeltaSerializer.prototype.getState = function () {
        return this.api.state;
    };
    FossilDeltaSerializer.prototype.setState = function (encodedState) {
        this.previousState = new Uint8Array(encodedState);
        this.api.set(msgpack.decode(this.previousState));
    };
    FossilDeltaSerializer.prototype.patch = function (binaryPatch) {
        // apply patch
        this.previousState = new Uint8Array(fossilDelta.apply(this.previousState, binaryPatch));
        // trigger update callbacks
        this.api.set(msgpack.decode(this.previousState));
    };
    FossilDeltaSerializer.prototype.teardown = function () {
        this.api.removeAllListeners();
    };
    return FossilDeltaSerializer;
}());
exports.FossilDeltaSerializer = FossilDeltaSerializer;
