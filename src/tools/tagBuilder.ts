import { Markdown } from "../html/markdown.js";
import { Tag } from "../html/tag.js";
import { Text } from "../html/text.js";
import { PageClasses } from "./cssClasses.js";

export const tagBuilder = <T extends Tag>(
  parent: Tag,
  tag: T,
  makeFirst: boolean = false
) => {
  parent.initTag(tag, makeFirst);
  return new TagBuilder(tag);
};

export class TagBuilder<T extends Tag> {
  tag: T;
  constructor(tag: T) {
    this.tag = tag;
  }
  // invoke function
  with(block: (tag: T) => void): TagBuilder<T> {
    block(this.tag);
    return this;
  }
  // Content additions
  text(value: string): TagBuilder<T> {
    this.tag.children.push(new Text(value));
    return this;
  }
  mdFile(source: string): TagBuilder<T> {
    this.tag.children.push(new Markdown(source));
    return this;
  }
  mdText(text: string): TagBuilder<T> {
    this.tag.children.push(new Markdown(text, true));
    return this;
  }
  // add attribute
  attr(key: string, value: string): TagBuilder<T> {
    this.tag.attributes[key] = value;
    return this;
  }
  style(value: string): TagBuilder<T> {
    this.tag.attributes["style"] = value;
    return this;
  }
  class(...value: PageClasses[]): TagBuilder<T> {
    if (this.tag.attributes["class"]) {
      this.tag.attributes["class"] += " " + value.join(" ");
    } else {
      this.tag.attributes["class"] = value.join(" ");
    }
    return this;
  }
  id(value: string): TagBuilder<T> {
    this.tag.attributes["id"] = value;
    return this;
  }
}
