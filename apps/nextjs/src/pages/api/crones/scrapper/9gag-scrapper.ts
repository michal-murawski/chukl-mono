import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { NextResponse, type NextRequest } from "next/server";
import chromiumAWS from "chrome-aws-lambda";
import { chromium, request, type APIRequestContext } from "playwright-core";

import type { MemePost, The9GagResponse } from "./types";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);

// 👇️ "/home/borislav/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log("directory-name 👉️", __dirname);

async function fetchHotMemes(
  context: APIRequestContext,
  nextCursor?: string,
  memes?: MemePost[],
): Promise<MemePost[]> {
  const hotUrl = "/v1/group-posts/type/top";

  console.log("### Current count: ", memes?.length);

  if (!memes?.length) {
    const response = await context.get(hotUrl);
    console.log(await context.storageState());
    console.log(response);
    const data = (await response.json()) as The9GagResponse;
    const memes = [];
    memes.push(...data.data.posts);

    return fetchHotMemes(context, data.data.nextCursor, memes);
  }

  // recursively fetch the next 1000 memes
  if (memes.length < 1000) {
    const nextUrl = `${hotUrl}?${nextCursor}`;
    const nextResponse = await context.get(nextUrl);
    const nextData = (await nextResponse.json()) as The9GagResponse;
    memes.push(...nextData.data.posts);

    return fetchHotMemes(context, nextData.data.nextCursor, memes);
  }

  return memes;
}

export default async function handler(_req: NextRequest, res: NextResponse) {
  const browser = await chromium.launch({
    headless:
      process.env.NODE_ENV !== "development" ? chromiumAWS.headless : true,
    args: chromiumAWS.args,
    executablePath:
      process.env.NODE_ENV !== "development"
        ? await chromiumAWS.executablePath
        : process.env.CHROME_EXECUTABLE_PATH,
  });
  const page = await browser.newPage({
    bypassCSP: true,
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
  const targetPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "db",
    "9gag.json",
  );

  try {
    fs.writeFileSync(targetPath, JSON.stringify(normalizedMemes), "utf8");
  } catch (error) {
    console.log(error);
  }

  // the end
  await browser.close();

  return new NextResponse(JSON.stringify(res), {
    status: 200,
  });
}
