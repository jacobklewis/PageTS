import { Element } from "../html/element.js";
import { Tag } from "../html/tag.js";
import { Text } from "../html/text.js";
import { assembleBreak } from "./compAssemble/sBreak.js";
import { assembleBtn } from "./compAssemble/sBtn.js";
import { assembleContent } from "./compAssemble/sContent.js";
import { assembleFor } from "./compAssemble/sFor.js";
import { assembleMD } from "./compAssemble/sMD.js";
import { assembleRouter } from "./compAssemble/sRouter.js";
import { tagBuilder } from "./tagBuilder.js";

export function parseHTML(config: TagConfig): Element[] {
  // console.log("Parsing HTML with config:", config);
  // Create a new Tag object
  const tags = [] as Element[];
  if (!config.innerHTML) {
    console.error("No innerHTML provided for tag: " + config.tag.name);
    return tags;
  }

  // Use a regular expression to extract the tag name and attributes
  //   const regex = /<([\w-]+)([^>]*)>(.*?)<\/\1>/gs;
  const regex =
    /(<!--.*?-->)|(<([\w-]+)\s*([^>]*?)\s*\/>)|(<([\w-]+)\s*([^>]*?)\s*>)(.*?)<\/\6>|([^<]+)/gs;
  //   const match = html.match(regex);

  let m = undefined;
  while ((m = regex.exec(config.innerHTML)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    if (m[1]) {
      // This is a comment, skip it
      continue;
    }
    // console.log(m[0]);
    if (m[9]) {
      // This is plain text, add it to the tag
      const text = m[9].trim();
      if (text === "") {
        continue;
      }
      tags.push(new Text(text));
      continue;
    }
    let isShort = m[3] !== undefined;
    // console.log("Is short:", isShort);

    const tagName = isShort ? m[3] : m[6];
    // console.log("Tag name:", tagName);
    const attributesString = isShort ? m[4] : m[7];
    // console.log("Attributes string:", attributesString);
    const innerHTML = isShort ? undefined : m[8];
    // console.log("Inner HTML:", innerHTML);
    const tag = new Tag(tagName, {}, !isShort);

    // Set the tag name
    tag.name = tagName;
    // Set the render tag type
    tag.renderTags = config.processConfig.renderTags;

    // Parse attributes
    const attributes: { [key: string]: string } = {};
    const attrRegex = /(\w+)(?:="([^"]*)")?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2] ?? "";
    }
    config.determineTagType(tagName)({
      tag: tag,
      attributes: attributes,
      innerHTML: innerHTML,
      processConfig: config.processConfig,
      variables: config.variables,
      next: parseHTML,
      determineTagType: config.determineTagType,
    });
    tags.push(tag);
  }

  return tags;
}

export function determineTagType(tagName: string): (config: TagConfig) => void {
  // Determine the type of tag based on its name
  //   console.log("Determining tag type for:", tagName);
  switch (tagName) {
    case "s-btn":
      return assembleBtn;
    case "s-content":
      return assembleContent;
    case "s-break":
      return assembleBreak;
    case "s-md":
      return assembleMD;
    case "s-for":
      return assembleFor;
    case "s-router":
      return assembleRouter;
    default:
      return (config: TagConfig) => {
        // Default processing for unknown tags
        config.tag.attributes = config.attributes;
        if (config.innerHTML) {
          const children = config.next(config);
          tagBuilder(undefined, config.tag).addChildren(children);
        }
      };
  }
}

export interface TagConfig {
  tag: Tag;
  attributes: { [key: string]: string };
  innerHTML: string | undefined;
  processConfig: ProcessConfig;
  variables: { [key: string]: any };
  next: (config: TagConfig) => Element[];
  determineTagType: (tagName: string) => (config: TagConfig) => void;
}

export interface ProcessConfig {
  title: string;
  description: string;
  date: string;
  renderTags: string[];
}
