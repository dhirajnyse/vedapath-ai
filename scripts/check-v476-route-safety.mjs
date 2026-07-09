import { existsSync, readFileSync } from "node:fs";

const failures = [];

function file(path) {
  return readFileSync(path, "utf8");
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const brand = file("brand/brand-board.html");
const shell = file("assets/vedapath-command-shell.js");
const notFound = file("404.html");
const staticLinks = file("scripts/check-static-links.mjs");

expect(brand.includes('href="../blueprint.html"'), "Brand board must link to root blueprint with ../");
expect(brand.includes('href="../daily.html"'), "Brand board must link to root daily with ../");
expect(brand.includes('href="brand-board.html"'), "Brand board self-link should not point to brand/brand-board.html from inside brand/");
expect(!brand.includes('href="blueprint.html"'), "Brand board should not contain nested blueprint link");
expect(!brand.includes('href="daily.html"'), "Brand board should not contain nested daily link");

expect(shell.includes("function siteHref"), "Command shell must normalize site hrefs");
expect(shell.includes("function pagePrefix"), "Command shell must derive page prefix from asset paths");
expect(shell.includes("href: siteHref("), "Command shell collected nav links must pass through siteHref");
expect(shell.includes("normalizePath(siteHref(href))"), "Command shell extra-link active matching must use siteHref");

expect(notFound.includes("brand\\/([^/]+\\.html)"), "404 route guard must detect stale brand/*.html routes");
expect(notFound.includes("window.location.replace(target)"), "404 route guard must redirect stale nested brand routes");
expect(notFound.includes("Open corrected page"), "404 route guard must expose a manual corrected-page link");

expect(staticLinks.includes('"404.html"'), "Static link checker must include 404.html");
expect(staticLinks.includes('"brand/brand-board.html"'), "Static link checker must include brand/brand-board.html");
expect(existsSync("blueprint.html"), "Root blueprint.html must exist");
expect(existsSync("daily.html"), "Root daily.html must exist");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("route-safety-ok v4.7.6");
