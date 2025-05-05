import { StringBuilder } from "../tools/stringBuilder.js";

export interface Element {
  render(stringBuilder: StringBuilder, options: ElementRenderOptions): void;
  renderTags: string[];
}

export interface ElementRenderOptions {
  renderTags: string[];
}
