// Import the Chromium browser into our scraper.
import { chromium } from "playwright";

async function scrape9GAGHomePage() {
  // Open a Chromium browser. We use headless: false
  // to be able to watch the browser window.
  const browser = await chromium.launch({
    headless: false,
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--no-zygote"],
  });

  // Open a new page / tab in the browser.
  const page = await browser.newPage({
    bypassCSP: true,
    viewport: { width: 1600, height: 900 },
    colorScheme: "dark",
  });

  // Tell the tab to navigate to the JavaScript topic page.
  await page.goto("https://9gag.com");

  console.log("LECI SCRAP");

  await page.locator('span:text("I ACCEPT")').click();

  console.log("click accept");

  const firstMemeLink = await page.waitForSelector(
    "#list-view-2 div article header > a",
  );
  const href = await firstMemeLink.getAttribute("href");
  console.log(href);

  // console.log(await page.locator("body"));

  // Turn off the browser to clean up after ourselves.
  await browser.close();
}

export { scrape9GAGHomePage };
