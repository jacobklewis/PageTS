import { tagBuilder } from "../tagBuilder.js";
import { TagConfig } from "../tagParser.js";

export const assembleMD = (c: TagConfig) => {
  // Verify attributes
  if (!c.attributes["file"]) {
    console.error("s-md: Missing 'file' attribute");
    throw new Error("s-md: Missing 'file' attribute");
  }

  tagBuilder(undefined, c.tag)
    .setName("div", true)
    .mdFile(c.attributes["file"]);
};
