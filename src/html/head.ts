import { HeaderTag } from "./tag.js";

export class Head extends HeaderTag {
  constructor(
    attributes: { [key: string]: string } = {},
    wrap: boolean = true
  ) {
    super("head", attributes, wrap);
  }
}
