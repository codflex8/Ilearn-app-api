"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsLink = containsLink;
function containsLink(message) {
    const urlPattern = new RegExp(/((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}|(localhost)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d+)?(\/\S*)?/gi);
    return urlPattern.test(message);
}
//# sourceMappingURL=extractLing.js.map