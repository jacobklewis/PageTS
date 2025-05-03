import { Tag } from "../../html/tag.js";
import { tagBuilder } from "../tagBuilder.js";
import { TagConfig } from "../tagParser.js";

export const assembleBreak = (c: TagConfig) => {
  tagBuilder(undefined, c.tag)
    .setName("div")
    .setWrap(true)
    .class("break")
    .attrs(c.attributes);
};
