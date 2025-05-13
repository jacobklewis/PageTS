import { readFileSync } from "fs";
import { Tag } from "../../html/tag.js";
import { tagBuilder } from "../tagBuilder.js";
import { ProcessConfig, TagConfig } from "../tagParser.js";
import fm from "front-matter";

export const assembleRouter = (c: TagConfig) => {
  const tb = tagBuilder(undefined, c.tag).setName("div", true);
  // get children
  const children = c.next(c);
  children.forEach((child) => {
    const tag = child as Tag;
    if (tag) {
      let path = tag.attributes["path"]?.split("/") || [];
      const filePath = tag.attributes["file"] || "";
      if (path.length > 1 && path[0] === "") {
        path = path.slice(1);
      }
      if (!path[0] && path[0] !== "") {
        console.log("No path provided for router tag");
        return;
      }
      const newPath = path[0];
      const fileData = readFileSync(filePath, "utf-8");
      // Process the file with front-matter
      const frontMatter = fm<ProcessConfig>(fileData);
      console.log("Route Front Matter:", frontMatter.attributes);
      const newRenderTags = [...c.processConfig.renderTags, newPath];
      const parsedChildren = c.next({
        tag: new Tag("newPath", {}, true),
        attributes: {},
        innerHTML: frontMatter.body,
        processConfig: {
          ...frontMatter.attributes,
          renderTags: newRenderTags,
        },
        variables: {},
        next: c.next,
        determineTagType: c.determineTagType,
      });
      tb.tag.renderTagAttributes[newRenderTags.join("/")] =
        frontMatter.attributes;
      // console.log("Parsed HTML nodes:", parsedChildren);
      tb.addChildren(parsedChildren);
      // console.log("tb", tb.tag);
    }
  });
};
