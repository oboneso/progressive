"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serializers = {};
function registerSerializer(id, serializer) {
    serializers[id] = serializer;
}
exports.registerSerializer = registerSerializer;
function getSerializer(id) {
    return serializers[id];
}
exports.getSerializer = getSerializer;
