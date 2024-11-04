export class GenericResponse<T extends object> {
  public pages: number;
  constructor(
    private page: number,
    private pageSize: number,
    private count: number,
    private items: T[]
  ) {
    this.page = page ? page : 1;
    this.pageSize = Number(pageSize);
    this.count = count;
    this.pages = Math.ceil(count / pageSize);
    this.items = items;
  }
}
