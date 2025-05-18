import { existsSync, readdirSync, readFileSync } from "fs";
import { tagBuilder } from "../tagBuilder.js";
import { ProcessConfig, TagConfig } from "../tagParser.js";
import fm from "front-matter";

export const assembleFor = (c: TagConfig) => {
  // Verify attributes
  if (!c.attributes["each"]) {
    console.error("s-for: Missing 'each' attribute");
    throw new Error("s-for: Missing 'each' attribute");
  }
  if (!c.attributes["from"]) {
    console.error("s-for: Missing 'from' attribute");
    throw new Error("s-for: Missing 'from' attribute");
  }
  const fEach = c.attributes["each"];
  const fFrom = c.attributes["from"];
  const fPath = c.attributes["path"] ?? fFrom;
  const fSortBy = c.attributes["sortBy"] ?? "";
  const fTake = parseInt(c.attributes["take"] ?? "100");
  const fSkip = parseInt(c.attributes["skip"] ?? "0");

  if (!existsSync(fFrom)) {
    throw new Error(`File ${fFrom} does not exist`);
  }
  const files = readdirSync(fFrom, "utf-8");
  const fmFileAttrs = [] as { name: string; attrs: ProcessConfig }[];
  for (const file of files) {
    if (file.endsWith(".md")) {
      const filePath = `${fFrom}/${file}`;
      const fileData = readFileSync(filePath, "utf-8");
      const frontMatter = fm<ProcessConfig>(fileData);
      fmFileAttrs.push({ name: file, attrs: frontMatter.attributes });
    }
  }
  // Sort the attributes if sortBy is provided
  if (fSortBy) {
    // fmFileAttrs.sort((a, b) => {
    //   if (a[fSortBy] < b[fSortBy]) return -1;
    //   if (a[fSortBy] > b[fSortBy]) return 1;
    //   return 0;
    // });
  }
  const loopContainer = tagBuilder(undefined, c.tag).setName("div");
  for (let i = fSkip; i < fTake && i < fmFileAttrs.length; i++) {
    const item = fmFileAttrs[i];
    // replace all instances of the following patterns in the innerHTML:
    // - {{fEach.key}} where key is the item keys
    const agumentedInnerHTML = c.innerHTML?.replace(
      new RegExp(`{{${fEach}\\.(\\w+)}}`, "g"),
      (match, key: string) => {
        if (key == "link") {
          return `/${fPath}/${item.name.replace(".md", "")}`;
        }
        return (item.attrs as Record<string, any>)[key] ?? "";
      }
    );
    console.log("Agumented InnerHTML:", agumentedInnerHTML);
    const elements = c.next({
      tag: c.tag,
      attributes: c.attributes,
      innerHTML: agumentedInnerHTML,
      processConfig: c.processConfig,
      variables: c.variables,
      next: c.next,
      determineTagType: c.determineTagType,
    });
    loopContainer.addChildren(elements);
  }
};
