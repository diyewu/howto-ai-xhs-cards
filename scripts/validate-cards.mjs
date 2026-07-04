#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;

const htmlArg = process.argv[2];
if (!htmlArg || htmlArg.startsWith("-")) {
  console.error("Usage: npm run validate:cards -- outputs/topic-xhs/topic-xhs.html --png-dir outputs/topic-xhs/png");
  process.exit(1);
}

const htmlPath = path.resolve(process.cwd(), htmlArg);
const pngDir = path.resolve(process.cwd(), getOption("--png-dir") || path.join(path.dirname(htmlPath), "png"));
const issues = [];
let browser;

try {
  if (!fs.existsSync(htmlPath)) issues.push(`HTML not found: ${htmlPath}`);
  if (!fs.existsSync(pngDir)) issues.push(`PNG dir not found: ${pngDir}`);

  let cardCount = 0;
  if (fs.existsSync(htmlPath)) {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: CARD_WIDTH, height: CARD_HEIGHT }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(htmlPath).href);
    await page.evaluate(() => document.fonts?.ready);
    const cards = page.locator(".card");
    cardCount = await cards.count();
    if (!cardCount) issues.push("No .card elements found.");
    for (let i = 0; i < cardCount; i += 1) {
      const box = await cards.nth(i).boundingBox();
      if (!box) {
        issues.push(`card-${i + 1}: no bounding box`);
        continue;
      }
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      if (width !== CARD_WIDTH || height !== CARD_HEIGHT) {
        issues.push(`card-${i + 1}: rendered ${width}x${height}, expected ${CARD_WIDTH}x${CARD_HEIGHT}`);
      }
    }
    await page.close();
  }

  const pngs = fs.existsSync(pngDir)
    ? fs.readdirSync(pngDir).filter((file) => /^card-\d+\.png$/.test(file)).sort()
    : [];

  if (cardCount && pngs.length !== cardCount) issues.push(`PNG count ${pngs.length}, expected ${cardCount}`);

  for (const png of pngs) {
    const filePath = path.join(pngDir, png);
    const size = readPngSize(filePath);
    if (size.width !== CARD_WIDTH || size.height !== CARD_HEIGHT) {
      issues.push(`${png}: ${size.width}x${size.height}, expected ${CARD_WIDTH}x${CARD_HEIGHT}`);
    }
  }

  const result = { html: htmlPath, pngDir, cardCount, pngCount: pngs.length, issues };
  console.log(JSON.stringify(result, null, 2));
  if (issues.length) process.exitCode = 1;
} catch (error) {
  if (String(error?.message || error).includes("Executable doesn't exist")) {
    console.error("Playwright Chromium is not installed. Run: npx playwright install chromium");
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error(`Not a PNG: ${filePath}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
