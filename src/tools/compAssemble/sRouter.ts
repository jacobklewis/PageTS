import { readdirSync, readFileSync } from "fs";
import { Tag } from "../../html/tag.js";
import { TagBuilder, tagBuilder } from "../tagBuilder.js";
import { ProcessConfig, TagConfig } from "../tagParser.js";
import fm from "front-matter";

export const assembleRouter = (c: TagConfig) => {
  const tb = tagBuilder(undefined, c.tag).setName("div", true);
  if (!c.attributes["from"]) {
    // get children
    processRouterChildren(c, tb);
  } else {
    processRouterFolder(c, tb);
  }
};
function processRouterChildren(c: TagConfig, tb: TagBuilder<Tag>) {
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
      tb.addChildren(parsedChildren);
    }
  });
}

function processRouterFolder(c: TagConfig, tb: TagBuilder<Tag>) {
  console.log("Processing router folder");
  const fFrom = c.attributes["from"];
  if (!fFrom) {
    console.error("s-router: Missing 'from' attribute");
    throw new Error("s-router: Missing 'from' attribute");
  }
  const files = readdirSync(fFrom, "utf-8");
  for (const file of files) {
    if (file.endsWith(".md")) {
      console.log("Processing file:", file);
      const filePath = `${fFrom}/${file}`;
      const fileData = readFileSync(filePath, "utf-8");
      const frontMatter = fm<ProcessConfig>(fileData);
      const newRenderTags = [
        ...c.processConfig.renderTags,
        file.replace(".md", ""),
      ];
      tb.tag.renderTagAttributes[newRenderTags.join("/")] =
        frontMatter.attributes;
      const md = tagBuilder(undefined, new Tag("div", {}, true)).mdText(
        frontMatter.body
      );
      md.tag.renderTags = newRenderTags;
      tb.addChildren([md.tag]);
    }
  }
}
