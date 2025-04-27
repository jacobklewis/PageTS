import { StringBuilder } from "../tools/stringBuilder.js";
import { Element } from "./element.js";

export class Text implements Element {
  constructor(public text: string) {}

  render(stringBuilder: StringBuilder) {
    stringBuilder.append(this.text);
  }
}
