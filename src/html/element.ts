import { StringBuilder } from "../tools/stringBuilder.js";

export interface Element {
  render(stringBuilder: StringBuilder): void;
}
