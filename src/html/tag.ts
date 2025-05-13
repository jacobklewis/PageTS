import { BtnConfig, createBtn } from "../components/btn.js";
import { StringBuilder } from "../tools/stringBuilder.js";
import { tagBuilder } from "../tools/tagBuilder.js";
import { ProcessConfig } from "../tools/tagParser.js";
import { Element, ElementRenderOptions } from "./element.js";

export class Tag implements Element {
  name: string;
  attributes: { [key: string]: string | undefined };
  wrap: boolean;
  prefix: string;
  children: Element[] = [];
  renderTags: string[] = [];
  renderTagAttributes: {
    [key: string]: ProcessConfig;
  } = {};
  renderScripts: ((renderTags: string[], tag: Tag) => void)[] = [];

  constructor(
    name: string,
    attributes: { [key: string]: string | undefined },
    wrap: boolean,
    prefix: string = ""
  ) {
    this.name = name;
    this.attributes = attributes;
    this.wrap = wrap;
    this.prefix = prefix;
  }
  initTag<T extends Tag>(tag: T, makeFirst: boolean = false): T {
    if (makeFirst) {
      this.children.unshift(tag);
    } else {
      this.children.push(tag);
    }
    return tag;
  }
  render(stringBuilder: StringBuilder, options: ElementRenderOptions): void {
    // Only render if the all render tags are in the options
    if (this.renderTags.length > 0) {
      for (const tag of this.renderTags) {
        if (!options.renderTags.includes(tag)) {
          return;
        }
      }
    }
    // Render scripts
    for (const renderScript of this.renderScripts) {
      renderScript(options.renderTags, this);
    }
    // Continue
    if (this.prefix && this.prefix.length > 0) {
      stringBuilder.append(`${this.prefix}\n`);
    }
    stringBuilder.append(`<${this.name}`);
    for (const [key, value] of Object.entries(this.attributes)) {
      if (value === undefined) {
        continue;
      }
      stringBuilder.append(` ${key}="${value}"`);
    }
    if (this.children.length === 0 && !this.wrap) {
      stringBuilder.append("/>\n");
      return;
    }
    stringBuilder.append(`>`);
    for (const child of this.children) {
      child.render(stringBuilder, options);
    }
    stringBuilder.append(`</${this.name}>\n`);
  }

  build(options: ElementRenderOptions): string {
    const stringBuilder = new StringBuilder();
    this.render(stringBuilder, options);
    return stringBuilder.toString();
  }
}

export class HeaderTag extends Tag {
  constructor(
    name: string,
    attributes: { [key: string]: string } = {},
    wrap: boolean = true
  ) {
    super(name, attributes, wrap);
  }
  tag(
    name: string,
    attributes: { [key: string]: string } = {},
    wrap: boolean = true
  ) {
    return tagBuilder(this, new BodyTag(name, attributes, wrap));
  }
  get meta() {
    return tagBuilder(this, new Tag("meta", {}, false));
  }
  get title() {
    return tagBuilder(this, new Tag("title", {}, true));
  }
  get link() {
    return tagBuilder(this, new Tag("link", {}, false));
  }
}

export class BodyTag extends Tag {
  constructor(
    name: string,
    attributes: { [key: string]: string | undefined } = {},
    wrap: boolean = true
  ) {
    super(name, attributes, wrap);
  }

  tag(
    name: string,
    attributes: { [key: string]: string } = {},
    wrap: boolean = true
  ) {
    return tagBuilder(this, new BodyTag(name, attributes, wrap));
  }
  // Creatable tags
  get br() {
    return tagBuilder(this, new BodyTag("br", {}, false));
  }
  get div() {
    return tagBuilder(this, new BodyTag("div", {}, true));
  }
  get span() {
    return tagBuilder(this, new BodyTag("span", {}, true));
  }
  get p() {
    return tagBuilder(this, new BodyTag("p", {}, true));
  }
  get a() {
    return tagBuilder(this, new BodyTag("a", {}, true));
  }
  get h1() {
    return tagBuilder(this, new BodyTag("h1", {}, true));
  }
  get h2() {
    return tagBuilder(this, new BodyTag("h2", {}, true));
  }
  get h3() {
    return tagBuilder(this, new BodyTag("h3", {}, true));
  }
  get h4() {
    return tagBuilder(this, new BodyTag("h4", {}, true));
  }
  get h5() {
    return tagBuilder(this, new BodyTag("h5", {}, true));
  }
  get h6() {
    return tagBuilder(this, new BodyTag("h6", {}, true));
  }
  // Components
  mdFile(source: string) {
    return tagBuilder(this, new BodyTag("div", {}, true)).mdFile(source);
  }
  mdText(text: string) {
    return tagBuilder(this, new BodyTag("div", {}, true)).mdText(text);
  }
  get break() {
    return tagBuilder(this, new BodyTag("div", { class: "break" }, true));
  }
  get content() {
    return tagBuilder(this, new BodyTag("div", { class: "content" }, true));
  }
  btn(config: Partial<BtnConfig>) {
    return createBtn(config, this);
  }
}
