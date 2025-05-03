import { tagBuilder } from "../tagBuilder.js";
import { TagConfig } from "../tagParser.js";

export const assembleContent = (c: TagConfig) => {
  console.log("Assembling content with attributes:", c.attributes);
  const content = tagBuilder(undefined, c.tag)
    .class("content")
    .setName("div")
    .attrs(c.attributes);
  if (c.innerHTML) {
    const children = c.next(c);
    content.addChildren(children);
  }
};
