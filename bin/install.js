#!/usr/bin/env node

// Installs the GhanaLeadFinder skill into the user's Claude skills
// directory: ~/.claude/skills/ghana-lead-finder
//
// Works with Claude Code (CLI), the desktop app, and the IDE extensions,
// which all read personal skills from ~/.claude/skills.

const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "ghana-lead-finder");
const targetRoot = path.join(os.homedir(), ".claude", "skills");
const target = path.join(targetRoot, "ghana-lead-finder");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(source)) {
  console.error(`Skill source not found: ${source}`);
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
copyDir(source, target);

console.log(`Installed Claude skill: ${target}`);
console.log("Restart Claude Code or start a new session if the skill does not appear immediately.");
