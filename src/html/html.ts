import { StringBuilder } from "../tools/stringBuilder.js";
import { tagBuilder } from "../tools/tagBuilder.js";
import { Body } from "./body.js";
import { Head } from "./head.js";
import { Tag } from "./tag.js";

export class HTML extends Tag {
  constructor(
    attributes: { [key: string]: string } = {},
    wrap: boolean = true
  ) {
    super("html", attributes, wrap, "<!DOCTYPE html>");
  }

  // Creatable tags
  get head() {
    return tagBuilder(this, new Head(), true);
  }
  get body() {
    return tagBuilder(this, new Body());
  }

  build(): string {
    const stringBuilder = new StringBuilder();
    this.render(stringBuilder);
    return stringBuilder.toString();
  }
}
