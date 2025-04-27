import { marked } from "../tools/marked.js";
import { StringBuilder } from "../tools/stringBuilder.js";
import { Element } from "./element.js";
import { readFileSync, existsSync } from "fs";

export class Markdown implements Element {
  constructor(public source: string, public parseDirectly: boolean = false) {}

  render(stringBuilder: StringBuilder) {
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
