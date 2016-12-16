#!/usr/bin/env node

"use strict";

//imports
const path = require("path");
const yargs = require("yargs");
const Cli = require("../lib/Cli").default;

//////////
// main //
//////////
var pkg, opts;

//(1) get package.json info
pkg = require("../package.json");

//(2) get arguments
opts = yargs
  .usage(
    "\nUsage:" +
    "\n  justo [options] [tasks]" +
    "\n  justo [--mute] -g generator [command] [parameters]" +
    "\n  justo [--mute] -g generator help [command]" +
    "\n  justo [--mute] -g generator dst" +
    "\n  justo -m module [tasks]"
  )
  .option("c", {
    alias: "catalog",
    describe: "List the cataloged tasks in the current Justo.js file.",
    type: "boolean",
    default: false
  })
  .option("debug", {
    describe: "Show more info when error caught by Justo.",
    type: "boolean",
    default: false
  })
  .option("g", {
    alias: "generate",
    describe: "Run the specified generator.",
    type: "string"
  })
  .help("h", "Show help.")
  // .alias("h", "help")
  .option("issue", {
    describe: "Show how to notify an issue.",
    type: "boolean",
    default: false
  })
  .option("m", {
    alias: "module",
    describe: "Run the Justo module installed globally with npm.",
    type: "string"
  })
  .option("mute", {
    describe: "Mute the reporter.",
    type: "boolean",
    default: false
  })
  .option("o", {
    alias: "only",
    describe: "Only run suites and tests fixed as only.",
    type: "boolean",
    default: false
  })
  .version("v", "Show CLI version.", pkg.version)
  .alias("v", "version")
  .epilogue(`Proudly made with ♥ in Valencia, Spain, EU.\nCopyright (c) ${pkg.years} ${pkg.author.name}.\nIn memory of Justo González Mallols.`)
  .argv;

//(3) run
if (opts.issue) {
  console.log("Web: https://github.com/justojs/justo-issues\nEmail: issues@justojs.org");
} else if (opts.generate) {
  let res;

  try {
    Cli.generate("./Justo.json", opts.generate.toLowerCase(), opts._, {mute: opts.mute});
    res = 0;
  }  catch (e) {
    if (opts.debug) console.error(e);
    else console.error(e.message);

    res = 1;
  }

  process.exit(res);
} else if (opts.catalog) {
  let res;

  try {
    Cli.listCatalogedTasks("./Justo.json");
    res = 0;
  } catch (e) {
    if (/Cannot find module.*node_modules.justo-loader/.test(e.message)) {
      console.error("It seems not to be installed the justo package.");
    }

    if (opts.debug) console.error(e);
    else console.error(e.message);

    res = 1;
  }

  process.exit(res);
} else {
  let res;

  try {
    if (opts.module) res = Cli.runInstalledModule(opts.module, opts._, {only: opts.only});
    else res = Cli.runCatalogedTasks("./Justo.json", opts._, {only: opts.only});
  } catch (e) {
    if (opts.debug) console.error(e);
    else console.error(e.message);

    res = {
      state: {
        name: "FAILED"
      }
    };
  }

  if (res.state.name == "FAILED") process.exit(1);
  else process.exit();
}
