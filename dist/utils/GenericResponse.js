"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericResponse = void 0;
class GenericResponse {
    constructor(page, pageSize, count, items) {
        this.page = page;
        this.pageSize = pageSize;
        this.count = count;
        this.items = items;
        this.page = page ? page : 1;
        this.pageSize = Number(pageSize);
        this.count = count;
        this.pages = Math.ceil(count / pageSize);
        this.items = items;
    }
}
exports.GenericResponse = GenericResponse;
//# sourceMappingURL=GenericResponse.js.map