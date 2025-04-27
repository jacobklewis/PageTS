import { BodyTag, Tag } from "./tag.js";

export class Body extends BodyTag {
  constructor(
    attributes: { [key: string]: string } = {},
    wrap: boolean = true
  ) {
    super("body", attributes, wrap);
  }
}
