import { Element, ElementRenderOptions } from "../html/element.js";
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
  setName(
    name: HTMLTag | string,
    wrap: boolean | undefined = undefined
  ): TagBuilder<T> {
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
  setRenderTags(renderTags: string[]): TagBuilder<T> {
    this.tag.renderTags = renderTags;
    return this;
  }
  addChildren(children: Element[]): TagBuilder<T> {
    this.tag.children.push(...children);
    return this;
  }
  // invoke function
  with(block: (tag: T) => void): TagBuilder<T> {
    block(this.tag);
    return this;
  }
  build(options: ElementRenderOptions): string {
    return this.tag.build(options);
  }
  determineRenderTags(): string[] {
    // Search tree for all renderTags
    const renderTags: Set<string> = new Set();
    renderTags.add("root/");
    const searchTree = (tag: Tag) => {
      if (tag.renderTags && tag.renderTags.length > 1) {
        renderTags.add(tag.renderTags.join("/"));
      }
      tag.children.forEach((child) => {
        if (child instanceof Tag) {
          searchTree(child);
        }
      });
    };
    searchTree(this.tag);
    console.log("Render Tags:", renderTags);
    return Array.from(renderTags);
  }
  // Content additions
  text(value: string, renderTags: string[] = []): TagBuilder<T> {
    this.tag.children.push(new Text(value, renderTags));
    return this;
  }
  mdFile(source: string, renderTags: string[] = []): TagBuilder<T> {
    this.tag.children.push(new Markdown(source, false, renderTags));
    return this;
  }
  mdText(text: string, renderTags: string[] = []): TagBuilder<T> {
    this.tag.children.push(new Markdown(text, true, renderTags));
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

export type HTMLTag =
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"
  | "li"
  | "a"
  | "img"
  | "button"
  | "input"
  | "textarea";
