// Import the Chromium browser into our scraper.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium, request, type APIRequestContext } from "playwright";

import {
  type MemePost,
  type The9GagHotResponse,
} from "~/scrappers/9gag/types.ts";

// 👇️ "/home/borislav/Desktop/javascript/index.js"
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);

// 👇️ "/home/borislav/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log("directory-name 👉️", __dirname);

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_EXECUTABLE_PATH,
  args: ["--no-sandbox", "--no-zygote"],
});

async function scrape9GAGHomePage() {
  // Open a new page / tab in the browser.
  const page = await browser.newPage({
    bypassCSP: true,
    viewport: { width: 1600, height: 900 },
    colorScheme: "dark",
  });

  // Tell the tab to navigate to the JavaScript topic page.

  console.log("LECI SCRAP");

  await page.locator('span:text("I ACCEPT")').click();

  console.log("click accept");

  const firstMemeLink = await page.waitForSelector(
    "#list-view-2 div article header > a",
  );
  const href = await firstMemeLink.getAttribute("href");
  console.log(href);

  await browser.close();
}

async function fetchHotMemes(
  context: APIRequestContext,
  nextCursor?: string,
  memes?: MemePost[],
): Promise<MemePost[]> {
  const hotUrl = "/v1/group-posts/type/top";

  console.log("### Current count: ", memes?.length);

  if (!memes?.length) {
    const response = await context.get(hotUrl);
    const data = (await response.json()) as The9GagHotResponse;
    const memes = [];
    memes.push(...data.data.posts);

    return fetchHotMemes(context, data.data.nextCursor, memes);
  }

  // recursively fetch the next 1000 memes
  if (memes.length < 1000) {
    const nextUrl = `${hotUrl}?${nextCursor}`;
    const nextResponse = await context.get(nextUrl);
    const nextData = (await nextResponse.json()) as The9GagHotResponse;
    memes.push(...nextData.data.posts);

    return fetchHotMemes(context, nextData.data.nextCursor, memes);
  }

  return memes;
}

async function scrape9GAGTopApi() {
  const page = await browser.newPage({
    bypassCSP: true,
    viewport: { width: 1600, height: 900 },
    colorScheme: "dark",
  });

  await page.goto("https://9gag.com");

  const apiRequestContext = page.context().request;
  const options = await apiRequestContext.storageState();

  const newContext = await request.newContext({
    storageState: options,
    baseURL: "https://9gag.com",
  });

  const allMemes = await fetchHotMemes(newContext);

  // normalize the memes by id
  const normalizedMemes = allMemes.reduce<Record<string, MemePost>>(
    (acc, meme) => {
      acc[meme.id] = meme;
      return acc;
    },
    {},
  );
  const targetPath = path.join(__dirname, "..", "..", "..", "db", "9gag.json");

  try {
    fs.writeFileSync(targetPath, JSON.stringify(normalizedMemes), "utf8");
  } catch (error) {
    console.log(error);
  }

  // Node: write into the 9gag.json file
  // fs.writeFileSync(JSON.stringify(normalizedMemes), "9gag.json", "utf8");

  // the end
  await browser.close();
}

export { scrape9GAGHomePage, scrape9GAGTopApi };
