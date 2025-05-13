#!/usr/bin/env node
import * as path from "path";
import { Config } from "../config.js";
import ts from "typescript";
import { existsSync, readFileSync } from "fs";
import { exec } from "child_process";
import { analyzeCSS, compileCSS } from "./cssTools.js";
import { compileTS } from "./compileTools.js";
import copyfiles from "copyfiles";
import fm from "front-matter";
import { determineTagType, parseHTML, ProcessConfig } from "./tagParser.js";
import { Tag } from "../html/tag.js";
import { assembleBtn } from "./compAssemble/sBtn.js";
import { tagBuilder } from "./tagBuilder.js";
import { buildSinglePage } from "../index.js";

export async function assembleProject() {
  await copyAssets();
  await compileCSS();
  analyzeCSS();
  compileTS();

  // Find the tsconfig.json file in the current directory or its parents
  const configPath = ts.findConfigFile(
    "./",
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configPath) {
    throw new Error('Could not find a valid "tsconfig.json".');
  }

  const config = JSON.parse(
    readFileSync("./pagets-config.json", "utf-8")
  ) as Config;

  // Read the contents of tsconfig.json
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  // const outDir = configFile.config.compilerOptions.outDir;
  const rootFile = config.entryFile.replace(/(\.ts|\.js)$/, ".js");
  const fileToEval = rootFile; //path.join(outDir, rootFile);
  // check if file exists
  if (!existsSync(fileToEval)) {
    throw new Error(`File ${fileToEval} does not exist.`);
  }
  // Run NPM command to execute the JavaScript file
  // const command = `node ${fileToEval}`;
  // console.log(`Executing command: ${command}`);
  // exec(command, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`Stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`Output: ${stdout}`);
  // });
  const fileData = readFileSync(fileToEval, "utf-8");
  // Process the file with front-matter
  const frontMatter = fm<ProcessConfig>(fileData);
  console.log("Front Matter:", frontMatter.attributes);
  const parsedChildren = parseHTML({
    tag: new Tag("root", {}, true),
    attributes: {},
    innerHTML: frontMatter.body,
    processConfig: { ...frontMatter.attributes, renderTags: ["root"] },
    variables: {},
    next: parseHTML,
    determineTagType: determineTagType,
  });
  const bodyHTML = tagBuilder(undefined, new Tag("body", {}, true)).addChildren(
    parsedChildren
  );
  bodyHTML.tag.renderTags = ["root/"];
  bodyHTML.tag.renderTagAttributes["root/"] = frontMatter.attributes;
  const tagsToRender = bodyHTML.determineRenderTags();
  const renderTagAttributes = bodyHTML.determineRenderTagAttributes();
  for (const tag of tagsToRender) {
    console.log("Rendering tag:", tag);
    // TODO:
    // 1. add title/description to tag metadata
    // 2. add navbar component for router
    const attrsToRender = renderTagAttributes[tag];

    const pagePath = path.join(
      config.publicDir,
      tag.replace("root", ""),
      `index.html`
    );
    buildSinglePage(
      {
        title: attrsToRender.title,
        description: attrsToRender.description,
        path: "/",
        buildBody(b) {
          b.children = parsedChildren;
        },
        buildHead(h) {},
      },
      pagePath,
      config,
      tag.split("/"),
      true
    );
  }
  // console.log("Parsed HTML:", bodyHTML.build({ renderTags: ["root", ""] }));
}

async function copyAssets() {
  const config = JSON.parse(
    readFileSync("./pagets-config.json", "utf-8")
  ) as Config;
  if (!config.assetsDir) {
    console.log("No assets directory specified in pagets-config.json");
    return;
  }
  const srcDir = config.assetsDir + "/**/*";
  const destDir = path.join(config.publicDir);
  copyfiles([srcDir, destDir], { up: 1 }, (err) => {
    if (err) {
      console.error("Error copying assets:", err);
    } else {
      console.log("Assets copied successfully!");
    }
  });
}

assembleProject();
