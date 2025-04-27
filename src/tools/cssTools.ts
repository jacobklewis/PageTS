#!/usr/bin/env node
import * as csstree from "css-tree";
import {
  readFileSync,
  writeFileSync,
  readFile,
  writeFile,
  existsSync,
  mkdirSync,
} from "fs";
import { StringBuilder } from "./stringBuilder.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { Config } from "../config.js";
import less from "less";

const builtinLess = `main.less`;
const builtinCss = `pagets-main.css`;

export function analyzeCSS() {
  // Load pagets-config.json
  const config = JSON.parse(
    readFileSync("./pagets-config.json", "utf-8")
  ) as Config;

  const classNames = new Set(); // Using a Set to avoid duplicates

  // get file name
  const classNamesObj = getCSSClasses(config);
  for (const cssFile in classNamesObj) {
    for (const className of classNamesObj[cssFile]) {
      classNames.add(className);
    }
  }

  const classNamesArr = Array.from(classNames);
  const sb = new StringBuilder();
  sb.append("export type PageClasses = ");
  sb.append(`"${classNamesArr.join('" | "')}"`);
  sb.append(";\n");
  // save to file

  writeFileSync(
    // "./dist/cssClasses.ts",
    path.join(path.dirname(fileURLToPath(import.meta.url)), "cssClasses.d.ts"),
    sb.toString()
  );

  return classNamesArr;
}

export function getCSSClasses(config: Config): { [key: string]: string[] } {
  const cssFiles = config.stylesLess.map((file) =>
    path.join(
      config.publicDir,
      "styles",
      file.replace(".less", ".css").split("/").pop() ?? ""
    )
  );
  // add builtin css
  cssFiles.push(path.join(config.publicDir, "styles", builtinCss));
  const classNames = {} as { [key: string]: string[] };
  for (const cssFile of cssFiles) {
    classNames[cssFile] = [];
    // Read the CSS file
    const cssString = readFileSync(cssFile, "utf-8");

    // Parse the CSS into an AST
    const ast = csstree.parse(cssString);

    // Collect class names
    csstree.walk(ast, (node) => {
      if (node.type === "ClassSelector") {
        classNames[cssFile].push(node.name);
      }
    });
  }
  return classNames;
}

export async function compileCSS() {
  // Load pagets-config.json
  const config = JSON.parse(
    readFileSync("./pagets-config.json", "utf-8")
  ) as Config;

  const cssFiles = config.stylesLess.map((file) =>
    path.join(
      config.publicDir,
      "styles",
      file.replace(".less", ".css").split("/").pop() ?? ""
    )
  );
  const lessFiles = config.stylesLess;
  // add builtin css
  const lessDir = path
    .dirname(fileURLToPath(import.meta.url))
    // replace the tools directory name with the less directory name
    .replace("tools", "less");
  lessFiles.push(path.join(lessDir, builtinLess));
  cssFiles.push(path.join(config.publicDir, "styles", builtinCss));

  for (let i = 0; i < cssFiles.length; i++) {
    // Define input and output file paths
    const inputFile = config.stylesLess[i];
    const outputFile = cssFiles[i];

    // Read the LESS file
    console.log(`Compiling ${inputFile} to ${outputFile}`);
    const data = readFileSync(inputFile, "utf8");
    if (!data) {
      console.error(`Error reading file: ${inputFile}`);
      return;
    }

    // Compile LESS to CSS
    const result = await less.render(data);
    if (!result) {
      console.error(`Error compiling LESS: ${inputFile}`);
      return;
    }

    // Write the compiled CSS to a file
    // check if the directory exists
    if (!existsSync(path.dirname(outputFile))) {
      mkdirSync(path.dirname(outputFile), { recursive: true });
    }
    writeFileSync(outputFile, result.css, "utf8");
  }
}

async function main() {
  await compileCSS();
  analyzeCSS();
}

main();
