import { ItemType, ViewType } from "@/lib/utils/types";
import dayjs from "dayjs";

export class ItemsViewOptions {
  private constructor(
    public type?: ItemType,
    public categoryIds?: string[],
    public occurredAtRange?: [Date | null, Date | null],
    public view?: ViewType,
    public page?: number,
  ) {}

  public static parseDateRange(range: [string | null, string | null]): [Date | null, Date | null] {
    const from = range[0] ? dayjs(range[0], "YYYY-MM-DD").startOf("day").toDate() : null;
    const to = range[1] ? dayjs(range[1], "YYYY-MM-DD").endOf("day").toDate() : null;
    return [from, to];
  }

  public static formatDateRange(range: [Date | null, Date | null]): [string | null, string | null] {
    const from = range[0] ? dayjs(range[0]).format("YYYY-MM-DD") : null;
    const to = range[1] ? dayjs(range[1]).format("YYYY-MM-DD") : null;
    return [from, to];
  }

  public static fromObject(obj: { [key: string]: string | string[] | undefined }): ItemsViewOptions {
    const type = typeof obj.type === "string" ? (obj.type as ItemType) : undefined;
    const categoryIds =
      typeof obj.categoryIds === "string"
        ? [obj.categoryIds]
        : Array.isArray(obj.categoryIds)
          ? obj.categoryIds
          : undefined;
    const occurredAtFrom = typeof obj.occurredAtFrom === "string" ? obj.occurredAtFrom : null;
    const occurredAtTo = typeof obj.occurredAtTo === "string" ? obj.occurredAtTo : null;
    const occurredAtRange =
      occurredAtFrom || occurredAtTo ? ItemsViewOptions.parseDateRange([occurredAtFrom, occurredAtTo]) : undefined;
    const view = typeof obj.view === "string" ? (obj.view as ViewType) : undefined;
    const page = typeof obj.page === "string" ? parseInt(obj.page) : undefined;
    return new ItemsViewOptions(type, categoryIds, occurredAtRange, view, page);
  }

  public static fromQueryParams(params: URLSearchParams): ItemsViewOptions {
    const obj = Object.fromEntries(params.entries());
    return ItemsViewOptions.fromObject(obj);
  }

  public toQueryParams(): URLSearchParams {
    const params = new URLSearchParams();
    if (this.type) {
      params.set("type", this.type);
    }
    if (this.categoryIds) {
      this.categoryIds.forEach((id) => params.append("categoryIds", id));
    }
    if (this.occurredAtRange) {
      if (this.occurredAtRange[0]) {
        params.set("occurredAtFrom", this.occurredAtRange[0].toISOString());
      }
      if (this.occurredAtRange[1]) {
        params.set("occurredAtTo", this.occurredAtRange[1].toISOString());
      }
    }
    if (this.view) {
      params.set("view", this.view);
    }
    if (this.page) {
      params.set("page", this.page.toString());
    }
    return params;
  }

  public toQueryString(): string {
    return this.toQueryParams().toString();
  }

  public copyWith(changes: Partial<ItemsViewOptions>): ItemsViewOptions {
    const newOptions = new ItemsViewOptions(
      this.type,
      this.categoryIds ? [...this.categoryIds] : undefined,
      this.occurredAtRange ? [...this.occurredAtRange] : undefined,
      this.view,
      this.page,
    );
    if (Object.hasOwn(changes, "type")) {
      newOptions.type = changes.type;
    }
    if (Object.hasOwn(changes, "categoryIds")) {
      newOptions.categoryIds = changes.categoryIds;
    }
    if (Object.hasOwn(changes, "occurredAtRange")) {
      newOptions.occurredAtRange = changes.occurredAtRange;
    }
    if (Object.hasOwn(changes, "view")) {
      newOptions.view = changes.view;
    }
    if (Object.hasOwn(changes, "page")) {
      newOptions.page = changes.page;
    }
    return newOptions;
  }

  public validate(): { valid: true } | { valid: false; redirect: string } {
    let valid = true;
    if (this.type && !["found", "lost"].includes(this.type)) {
      valid = false;
    } else if (this.view && !["list", "map"].includes(this.view)) {
      valid = false;
    } else if (this.view === "map" && typeof this.page !== "undefined") {
      valid = false;
    } else if (this.view === "list" && typeof this.page === "undefined") {
      valid = false;
    }
    if (valid) {
      return { valid: true };
    }
    const validType = this.type && ["found", "lost"].includes(this.type) ? this.type : "found";
    const validView = this.view && ["list", "map"].includes(this.view) ? this.view : "list";
    const redirectParams = this.toQueryParams();
    redirectParams.set("type", validType);
    redirectParams.set("view", validView);
    if (validView === "list") {
      redirectParams.set("page", this.page ? this.page.toString() : "1");
    } else {
      redirectParams.delete("page");
    }
    return { valid: false, redirect: `?${redirectParams.toString()}` };
  }

  public getRedirectUrl(): string {
    const validation = this.validate();
    if (validation.valid) {
      return `?${this.toQueryString()}`;
    }
    return validation.redirect;
  }
}
