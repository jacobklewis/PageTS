#!/usr/bin/env node
import * as path from "path";
import { Config } from "../config.js";
import ts from "typescript";

export function compileTS() {
  // Load pagets-config.json
  // const config = JSON.parse(
  //   readFileSync("./pagets-config.json", "utf-8")
  // ) as Config;

  // Find the tsconfig.json file in the current directory or its parents
  const configPath = ts.findConfigFile(
    "./",
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configPath) {
    throw new Error('Could not find a valid "tsconfig.json".');
  }

  // Read the contents of tsconfig.json
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n")
    );
  }

  // Parse the config file to get compiler options and file names
  const config = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  // Check for configuration errors
  if (config.errors.length > 0) {
    console.error("Errors in tsconfig.json:");
    config.errors.forEach((error) =>
      console.error(ts.flattenDiagnosticMessageText(error.messageText, "\n"))
    );
    return;
  }

  // Create a TypeScript program with the files and options from tsconfig.json
  const program = ts.createProgram(config.fileNames, config.options);

  // Emit the compiled JavaScript files
  const emitResult = program.emit();

  // Collect all diagnostics (pre-emit and emit-time errors/warnings)
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  // Log diagnostics if any
  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start ?? 0
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  // Determine success or failure
  const exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Compilation ${exitCode === 0 ? "succeeded" : "failed"}`);
}

compileTS();
