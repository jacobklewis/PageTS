import { Markdown } from "../html/markdown.js";
import { Tag } from "../html/tag.js";
import { Text } from "../html/text.js";
import { PageClasses } from "./cssClasses.js";

export const tagBuilder = <T extends Tag>(
  parent: Tag | undefined,
  tag: T,
  makeFirst: boolean = false
) => {
  parent?.initTag(tag, makeFirst);
  return new TagBuilder(tag);
};

export class TagBuilder<T extends Tag> {
  tag: T;
  constructor(tag: T) {
    this.tag = tag;
  }
  setName(name: string, wrap: boolean | undefined = undefined): TagBuilder<T> {
    this.tag.name = name;
    if (wrap !== undefined) {
      this.setWrap(wrap);
    }
    return this;
  }
  setWrap(wrap: boolean): TagBuilder<T> {
    this.tag.wrap = wrap;
    return this;
  }
  addChildren(children: Tag[]): TagBuilder<T> {
    this.tag.children.push(...children);
    return this;
  }
  // invoke function
  with(block: (tag: T) => void): TagBuilder<T> {
    block(this.tag);
    return this;
  }
  build(): string {
    return this.tag.build();
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
  attrs(attrs: { [key: string]: string }): TagBuilder<T> {
    for (const key in attrs) {
      this.attr(key, attrs[key]);
    }
    return this;
  }
  // add classes
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
