import http from "http";

import the9gagjson from "../db/9gag.json" assert { type: "json" };
import { scrape9GAGTopApi } from "./scrappers/9gag/9gag-scrapper.ts";

export const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "It Works!",
    }),
  );
});

// await scrape9GAGTopApi();
console.log(Object.keys(the9gagjson).length);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
