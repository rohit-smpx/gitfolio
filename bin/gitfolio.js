#! /usr/bin/env node
/* Argument parser */
const program = require("commander");

process.env.OUT_DIR = process.env.OUT_DIR || process.cwd();

const { buildCommand } = require("../build");
const { updateCommand } = require("../update");
const { blogCommand } = require("../blog");
const { runCommand } = require("../run");
const { version } = require("../package.json");

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .command("build <username>")
  .description(
    "Build site with your GitHub username. This will be used to customize your site"
  )
  .option("-t, --theme [theme]", "specify a theme to use", "light")
  .option("-b, --background [background]", "set the background image")
  .option("-f, --fork", "includes forks with repos")
  .option(
    "-i, --include [types]",
    "specifiy type of repos to include(can be multiple) : 'all', 'owner', 'member'",
    collect,
    []
  )
  .option("-s, --sort [sort]", "set default sort for repository", "created")
  .option("-o, --order [order]", "set default order on sort", "asc")
  .option("-w, --twitter [username]", "specify twitter username")
  .option("-l, --linkedin [username]", "specify linkedin username")
  .option("-m, --medium [username]", "specify medium username")
  .option("-d, --dribbble [username]", "specify dribbble username")
  .action(buildCommand);

program
  .command("update")
  .description("Update user and repository data")
  .action(updateCommand);

program
  .command("blog <title>")
  .description("Create blog with specified title")
  .option("-s, --subtitle [subtitle]", "give blog a subtitle", "")
  .option("-p, --pagetitle [pagetitle]", "give blog page a title")
  .option(
    "-f, --folder [folder]",
    'give folder a title (use "-" instead of spaces)'
  )
  .option("-i, --image [image]", "give image for blog cover")
  .option("-u, --update", "update existing blog if exists")
  .action(blogCommand);

program
  .command("run")
  .description("Run build files")
  .option(
    "-p, --port [port]",
    "provide a port for localhost, default is 3000",
    3000
  )
  .action(runCommand);

program.on("command:*", () => {
  console.log("Unknown Command: " + program.args.join(" "));
  program.help();
});

program
  .version(version, "-v --version")
  .usage("<command> [options]")
  .parse(process.argv);

if (program.args.length === 0) program.help();
