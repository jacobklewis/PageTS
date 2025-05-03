import { Tag } from "../html/tag.js";
import { assembleBreak } from "./compAssemble/sBreak.js";
import { assembleBtn } from "./compAssemble/sBtn.js";
import { assembleContent } from "./compAssemble/sContent.js";
import { assembleMD } from "./compAssemble/sMD.js";

export function parseHTML(config: TagConfig): Tag[] {
  // Create a new Tag object
  const tags = [] as Tag[];
  if (!config.innerHTML) {
    console.error("No innerHTML provided for tag: " + config.tag.name);
    return tags;
  }

  // Use a regular expression to extract the tag name and attributes
  //   const regex = /<([\w-]+)([^>]*)>(.*?)<\/\1>/gs;
  const regex =
    /(<([\w-]+)\s*([^>]*?)\s*\/>)|(<([\w-]+)\s*([^>]*?)\s*>)(.*?)<\/\5>/gs;
  //   const match = html.match(regex);

  let m = undefined;
  while ((m = regex.exec(config.innerHTML)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    let isShort = m[2] !== undefined;
    // console.log("Is short:", isShort);

    const tagName = isShort ? m[2] : m[5];
    // console.log("Tag name:", tagName);
    const attributesString = isShort ? m[3] : m[6];
    // console.log("Attributes string:", attributesString);
    const innerHTML = isShort ? undefined : m[7];
    // console.log("Inner HTML:", innerHTML);
    const tag = new Tag(tagName, {}, !isShort);

    // Set the tag name and inner HTML
    tag.name = tagName;
    // tag.innerHTML = innerHTML;

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
    default:
      return (config: TagConfig) => {
        // Default processing for unknown tags
        config.tag.attributes = config.attributes;
        if (config.innerHTML) {
          const children = config.next(config);
          config.tag.children = children;
        }
      };
  }
}

export interface TagConfig {
  tag: Tag;
  attributes: { [key: string]: string };
  innerHTML: string | undefined;
  processConfig: ProcessConfig;
  next: (config: TagConfig) => Tag[];
  determineTagType: (tagName: string) => (config: TagConfig) => void;
}

export interface ProcessConfig {
  title: string;
  description: string;
}
