import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { EntryContract } from "./contracts/entryContract.js";
import { HTML } from "./html/html.js";
import { Config } from "./config.js";
import path from "path";
import { getCSSClasses } from "./tools/cssTools.js";
import { Tag } from "./html/tag.js";
import { PageContract } from "./contracts/pageContract.js";

export { Body } from "./html/body.js";
export { Head } from "./html/head.js";
export { HTML } from "./html/html.js";
export { Tag, HeaderTag, BodyTag } from "./html/tag.js";
export { analyzeCSS } from "./tools/cssTools.js";
export { TagBuilder } from "./tools/tagBuilder.js";
export { PageContract } from "./contracts/pageContract.js";
export { EntryContract } from "./contracts/entryContract.js";
export { BtnConfig } from "./components/btn.js";

export const buildStatic = async (app: EntryContract) => {
  const config = JSON.parse(
    readFileSync("./pagets-config.json", "utf-8")
  ) as Config;

  for (const page of app.assemble()) {
    const pagePath = path.join(config.publicDir, page.path, `index.html`);

    const htmlStr = buildSinglePage(page, pagePath, config);
    // save to html file using fs
    // check if the directory exists
    if (!existsSync(path.dirname(pagePath))) {
      mkdirSync(path.dirname(pagePath), { recursive: true });
    }
    writeFileSync(pagePath, htmlStr);
  }
};

export const buildSinglePage = (
  page: PageContract,
  pagePath: string,
  config: Config,
  renderTags: string[] = [],
  shouldSaveToFile: boolean = false
) => {
  const html = new HTML({ lang: "en" });
  // Add custom body tags
  html.body.with((b) => {
    page.buildBody(b);
  });
  // Calculate styles used
  const cssClasses = getCSSClasses(config);
  const styleFiles = calculateClassFilesUsed(
    html.children[0] as Tag,
    cssClasses
  );
  // console.log("Style files used: ", styleFiles);
  html.head.with((h) => {
    h.meta.attr("charset", "UTF-8");
    h.meta
      .attr("name", "viewport")
      .attr("content", "width=device-width, initial-scale=1.0");
    h.meta.attr("name", "description").attr("content", page.description);
    h.link
      .attr("rel", "stylesheet")
      .attr(
        "href",
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/default.min.css"
      );

    for (const file of styleFiles) {
      // remove prefix from file name
      console.log(`relative style path: ${pagePath} to ${file}`);
      const fileName = path.relative(path.dirname(pagePath), file);

      h.link.attr("rel", "stylesheet").attr("href", fileName);
    }
    h.title.text(page.title);
  });
  // Add add custom head tags
  html.head.with((h) => {
    if (page.buildHead) {
      page.buildHead(h);
    }
  });
  const htmlStr = html.body.build({ renderTags });
  if (shouldSaveToFile) {
    // check if the directory exists
    if (!existsSync(path.dirname(pagePath))) {
      mkdirSync(path.dirname(pagePath), { recursive: true });
    }
    writeFileSync(pagePath, htmlStr);
  }
  return htmlStr;
};

function calculateClassFilesUsed(
  tag: Tag,
  cssClasses: { [key: string]: string[] }
): Set<string> {
  //   console.log(`Calculating class files used for tag:`, tag);
  const classFilesUsed = new Set<string>();
  for (const className of tag.attributes["class"]?.split(" ") ?? []) {
    for (const [file, classes] of Object.entries(cssClasses)) {
      if (classes.includes(className)) {
        classFilesUsed.add(file);
      }
    }
  }
  for (const child of tag.children) {
    // console.log(`Calculating class files used for child:`, child);
    if (child instanceof Tag) {
      const childClassFilesUsed = calculateClassFilesUsed(child, cssClasses);
      for (const file of childClassFilesUsed) {
        classFilesUsed.add(file);
      }
    }
  }
  return classFilesUsed;
}
