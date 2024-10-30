export class GenericResponse<T extends object> {
  page: number;
  pageSize: number;
  count: number;
  pages: number;
  items: T[];
  constructor(page: number, pageSize: number, count: number, items: T[]) {
    this.page = page ? page : 1;
    this.pageSize = Number(pageSize);
    this.count = count;
    this.pages = Math.ceil(count / pageSize);
    this.items = items;
  }
}
