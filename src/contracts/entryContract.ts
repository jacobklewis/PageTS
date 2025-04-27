import { BodyTag, HeaderTag } from "../html/tag";
import { TagBuilder } from "../tools/tagBuilder.js";
import { PageContract } from "./pageContract";

export interface EntryContract {
  assemble: () => PageContract[];
}
