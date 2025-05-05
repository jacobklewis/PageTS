import { StringBuilder } from "../tools/stringBuilder.js";
import { Element, ElementRenderOptions } from "./element.js";

export class Text implements Element {
  constructor(public text: string, public renderTags: string[] = []) {}

  render(stringBuilder: StringBuilder, options: ElementRenderOptions) {
    // Only render if the all render tags are in the options
    if (this.renderTags.length > 0) {
      for (const tag of this.renderTags) {
        if (!options.renderTags.includes(tag)) {
          return;
        }
      }
    }
    // Continue
    stringBuilder.append(this.text);
  }
}
