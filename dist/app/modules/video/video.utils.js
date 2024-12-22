"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = escapeRegex;
function escapeRegex(string) {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}
