import { marked } from "../tools/marked.js";
import { StringBuilder } from "../tools/stringBuilder.js";
import { Element, ElementRenderOptions } from "./element.js";
import { readFileSync, existsSync } from "fs";

export class Markdown implements Element {
  constructor(
    public source: string,
    public parseDirectly: boolean = false,
    public renderTags: string[] = []
  ) {}

  render(stringBuilder: StringBuilder, options: ElementRenderOptions): void {
    // Only render if the all render tags are in the options
    if (this.renderTags.length > 0) {
      for (const tag of this.renderTags) {
        if (!options.renderTags.includes(tag)) {
          return;
        }
      }
    }
    // Continue
    if (this.parseDirectly) {
      stringBuilder.append(marked.parse(this.source, { async: false }));
      return;
    }
    if (!existsSync(this.source)) {
      throw new Error(`File ${this.source} does not exist`);
    }
    const body = readFileSync(this.source, "utf-8");
    stringBuilder.append(marked.parse(body, { async: false }));
  }
}
