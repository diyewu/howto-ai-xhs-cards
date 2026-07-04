#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const htmlArg = process.argv[2];
if (!htmlArg || htmlArg.startsWith("-")) {
  console.error("Usage: npm run export:cards -- outputs/topic-xhs/topic-xhs.html");
  process.exit(1);
}

const htmlPath = path.resolve(process.cwd(), htmlArg);
const outDir = path.dirname(htmlPath);
const baseName = path.basename(htmlPath, ".html");
const pngDir = path.join(outDir, "png");
const contactSheetPath = path.join(outDir, "contact-sheet.png");
const reportPath = path.join(outDir, "export-report.json");
const zipPath = path.join(outDir, `${baseName}-png.zip`);
const tempContactHtmlPath = path.join(outDir, ".contact-sheet.html");

if (!fs.existsSync(htmlPath)) {
  console.error(`HTML not found: ${htmlPath}`);
  process.exit(1);
}

fs.rmSync(pngDir, { recursive: true, force: true });
fs.mkdirSync(pngDir, { recursive: true });
fs.rmSync(contactSheetPath, { force: true });
fs.rmSync(reportPath, { force: true });
fs.rmSync(zipPath, { force: true });
fs.rmSync(tempContactHtmlPath, { force: true });

const issues = [];
const cards = [];
let browser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: CARD_WIDTH, height: CARD_HEIGHT }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href);
  await page.evaluate(() => document.fonts?.ready);

  const locators = page.locator(".card");
  const cardCount = await locators.count();
  if (!cardCount) throw new Error("No .card elements found.");

  for (let i = 0; i < cardCount; i += 1) {
    const card = locators.nth(i);
    const box = await card.boundingBox();
    if (!box) {
      issues.push(`card-${i + 1}: no bounding box`);
      continue;
    }
    const width = Math.round(box.width);
    const height = Math.round(box.height);
    if (width !== CARD_WIDTH || height !== CARD_HEIGHT) {
      issues.push(`card-${i + 1}: rendered ${width}x${height}, expected ${CARD_WIDTH}x${CARD_HEIGHT}`);
    }
    const fileName = `card-${String(i + 1).padStart(2, "0")}.png`;
    const filePath = path.join(pngDir, fileName);
    await card.screenshot({ path: filePath });
    const size = readPngSize(filePath);
    if (size.width !== CARD_WIDTH || size.height !== CARD_HEIGHT) {
      issues.push(`${fileName}: png ${size.width}x${size.height}, expected ${CARD_WIDTH}x${CARD_HEIGHT}`);
    }
    cards.push({ index: i + 1, file: filePath, width: size.width, height: size.height, bytes: fs.statSync(filePath).size });
  }

  await buildContactSheet(browser, cards, tempContactHtmlPath, contactSheetPath);
  writeZip(zipPath, cards.map((card) => ({ diskPath: card.file, zipName: path.basename(card.file) })));

  const report = {
    generatedAt: new Date().toISOString(),
    html: htmlPath,
    pngDir,
    contactSheet: contactSheetPath,
    zip: zipPath,
    cardCount: cards.length,
    cards,
    issues
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
} catch (error) {
  if (String(error?.message || error).includes("Executable doesn't exist")) {
    console.error("Playwright Chromium is not installed. Run: npx playwright install chromium");
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  fs.rmSync(tempContactHtmlPath, { force: true });
  await browser?.close();
}

async function buildContactSheet(browser, cards, htmlPathForSheet, imagePath) {
  const columns = Math.min(4, cards.length);
  const thumbWidth = 240;
  const thumbHeight = 320;
  const gap = 24;
  const padding = 42;
  const titleHeight = 76;
  const rows = Math.ceil(cards.length / columns);
  const width = padding * 2 + columns * thumbWidth + (columns - 1) * gap;
  const height = padding * 2 + titleHeight + rows * (thumbHeight + 44) + (rows - 1) * gap;
  const imgs = cards.map((card) => {
    const src = pathToFileURL(card.file).href;
    const label = path.basename(card.file);
    return `<figure><img src="${src}"><figcaption>${label}</figcaption></figure>`;
  }).join("");
  fs.writeFileSync(htmlPathForSheet, `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;width:${width}px;min-height:${height}px;padding:${padding}px;background:#f7fbff;font-family:Arial,sans-serif;color:#172033}
    h1{margin:0 0 28px;font-size:36px}.grid{display:grid;grid-template-columns:repeat(${columns},${thumbWidth}px);gap:${gap}px}
    figure{margin:0}img{display:block;width:${thumbWidth}px;height:${thumbHeight}px;object-fit:cover;border:1px solid #dbe7f3;box-shadow:0 8px 24px rgba(23,32,51,.08)}
    figcaption{height:36px;padding-top:10px;text-align:center;font-size:16px;font-weight:700;color:#65738a}
  </style></head><body><h1>Contact Sheet · ${cards.length} cards</h1><div class="grid">${imgs}</div></body></html>`);
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPathForSheet).href);
  await page.screenshot({ path: imagePath, fullPage: true });
  await page.close();
}

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error(`Not a PNG: ${filePath}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function writeZip(zipPath, entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const data = fs.readFileSync(entry.diskPath);
    const name = Buffer.from(entry.zipName);
    const crc = crc32(data);
    const { time, date } = dosTimeDate(fs.statSync(entry.diskPath).mtime);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  fs.writeFileSync(zipPath, Buffer.concat([...localParts, ...centralParts, end]));
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTimeDate(value) {
  const d = new Date(value);
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
  };
}
