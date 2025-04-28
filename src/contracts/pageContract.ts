import { BodyTag, HeaderTag } from "../html/tag";
import { TagBuilder } from "../tools/tagBuilder.js";

export interface PageContract {
  path: string;
  title: string;
  description: string;
  // keywords: string[];
  buildHead: (h: HeaderTag) => void;
  buildBody: (b: BodyTag) => void;
}
