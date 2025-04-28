#!/usr/bin/env node
import * as path from "path";
import { Config } from "../config.js";
import ts from "typescript";
import { existsSync, readFileSync } from "fs";
import { exec } from "child_process";
import { analyzeCSS, compileCSS } from "./cssTools.js";
import { compileTS } from "./compileTools.js";
import copyfiles from "copyfiles";

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
  const outDir = configFile.config.compilerOptions.outDir;
  const rootFile = config.entryFile.replace(/(\.ts|\.js)$/, ".js");
  const fileToEval = path.join(outDir, rootFile);
  // check if file exists
  if (!existsSync(fileToEval)) {
    throw new Error(`File ${fileToEval} does not exist.`);
  }
  // Run NPM command to execute the JavaScript file
  const command = `node ${fileToEval}`;
  console.log(`Executing command: ${command}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Output: ${stdout}`);
  });
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
