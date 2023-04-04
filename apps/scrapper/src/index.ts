import http from "http";

import { scrape9GAGHomePage } from "./scrappers/9gag-scrapper.ts";

export const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "It Works!",
    }),
  );
});

await scrape9GAGHomePage();

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
