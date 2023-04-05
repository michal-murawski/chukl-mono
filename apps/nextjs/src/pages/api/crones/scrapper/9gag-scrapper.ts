import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { NextApiRequest, NextApiResponse } from "next";
import * as async from "async";
import { chain } from "lodash";

import type { The9GagCommentsResponse } from "~/pages/api/crones/scrapper/comments-types";
import type {
  ScrappedCommentDB,
  The9GAGPostWithComments,
} from "~/pages/api/crones/scrapper/common-types";
import type { The9GAGPost, The9GagPostsResponse } from "./posts-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("directory-name 👉️", __dirname);

const POSTS_LIMIT = 1000;

async function fetchComments({
  memeId,
  commentId,
  type,
}: {
  type: "new" | "hot";
  memeId?: string;
  commentId?: string;
}): Promise<The9GagCommentsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("appId", "a_dd8f2b7d304a10edaf6f29517ea0ca4100a43d1b");
  searchParams.set("count", "100");
  searchParams.set("type", type);
  searchParams.set("viewMode", "list");
  searchParams.set("url", `http://9gag.com/gag/${memeId}`);
  searchParams.set("origin", "https://9gag.com");

  memeId && searchParams.set("postKey", memeId);
  commentId && searchParams.set("commentId", commentId);

  const response = await fetch(
    `https://comment-cdn.9gag.com/v2/cacheable/comment-list.json?${searchParams.toString()}`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "pl-PL,pl;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
        "sec-ch-ua":
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrer: "https://9gag.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch 9gag comments: " + response.statusText);
  }

  return (await response.json()) as Promise<The9GagCommentsResponse>;
}

async function fetchPosts(
  path: "home" | "top",
  nextCursor?: string,
): Promise<The9GagPostsResponse> {
  let url: string;

  if (path === "home") {
    url = "https://9gag.com/v1/feed-posts/type/home";
  } else {
    url = "https://9gag.com/v1/group-posts/type";
  }

  const response = await fetch(`${url}?${nextCursor}`, {
    headers: {
      accept: "*/*",
      "accept-language": "pl-PL,pl;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
      "sec-ch-ua":
        '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie:
        "auto_log=%7B%22lo%22%3Afalse%2C%22d%22%3Afalse%2C%22a%22%3Atrue%2C%22dl%22%3Afalse%7D; sign_up_referer=https%3A%2F%2F9gag.com%2F; addtl_consent=1~39.4.3.9.6.9.13.6.4.15.9.5.2.11.1.7.1.3.2.10.3.5.4.21.4.6.9.7.10.2.9.2.18.7.20.5.20.6.5.1.4.11.29.4.14.4.5.3.10.6.2.9.6.6.9.4.4.29.4.5.3.1.6.2.2.17.1.17.10.9.1.8.6.2.8.3.4.146.8.42.15.1.14.3.1.18.25.3.7.25.5.18.9.7.41.2.4.18.21.3.4.2.7.6.5.2.14.18.7.3.2.2.8.20.8.8.6.3.10.4.20.2.13.4.6.4.11.1.3.22.16.2.6.8.2.4.11.6.5.33.11.8.1.10.28.12.1.3.21.2.7.6.1.9.30.17.4.9.15.8.7.3.6.6.7.2.4.1.7.12.13.22.13.2.12.2.10.1.4.15.2.4.9.4.5.4.7.13.5.15.4.13.4.14.10.15.2.5.6.2.2.1.2.14.7.4.8.2.9.10.18.12.13.2.18.1.1.3.1.1.9.25.4.1.19.8.4.5.3.5.4.8.4.2.2.2.14.2.13.4.2.6.9.6.3.2.2.3.5.2.3.6.10.11.6.3.16.3.11.3.1.2.3.9.19.11.15.3.10.7.6.4.3.4.6.3.3.3.3.1.1.1.6.11.3.1.1.11.6.1.10.5.2.6.3.2.2.4.3.2.2.7.15.7.14.1.3.3.4.5.4.3.2.2.5.4.1.1.2.9.1.6.9.1.5.2.1.7.10.11.1.3.1.1.2.1.3.2.6.1.12.5.3.1.3.1.1.2.2.7.7.1.4.1.2.6.1.2.1.1.3.1.1.4.1.1.2.1.8.1.7.4.3.2.1.3.5.3.9.6.1.15.10.28.1.2.2.12.3.4.1.6.3.4.7.1.3.1.1.3.1.5.3.1.3.4.1.1.4.2.1.2.1.2.2.2.4.2.1.2.2.2.4.1.1.1.2.2.1.1.1.1.2.1.1.1.2.2.1.1.2.1.2.1.7.1.2.1.1.1.2.1.1.1.1.2.1.1.3.2.1.1.8.1.1.6.2.1.6.2.3.2.1.1.1.2.2.3.1.1.4.1.1.2.2.1.1.4.3.1.2.2.1.2.1.2.3.1.1.2.4.1.1.1.5.1.3.6.3.1.5.2.3.4.1.2.3.1.4.2.1.2.2.2.1.1.1.1.1.1.11.1.3.1.1.2.2.5.2.3.3.5.1.1.1.4.2.1.1.2.5.1.9.4.1.1.3.1.7.1.4.5.1.7.2.1.1.1.2.1.1.1.4.2.1.12.1.1.3.1.2.2.3.1.2.1.1.1.2.1.1.2.1.1.1.1.2.4.1.5.1.2.4.3.8.2.2.9.7.2.2.1.2.1.4.6.1.1.6.1.1.2.6.3.1.2.201.300.100; cchk=1; euconsent-v2=CPpshUAPpshUAAKAuAENC-CsAP_AAH_AAA5QJUtd_H__bW9r-f5_aft0eY1P9_r77uQzDhfNk-4F3L_W_LwX52E7NF36tq4KmR4ku1LBIUNlHNHUDVmwaokVryHsak2cpTNKJ6BEkHMZO2dYGF5vmxtj-QKY5_5_d3bx2D-t_9v-39z3z81Xn3d5_-_02PCdU5_9Dfn9fR_b-9KP9_78v8v8_9_rk2_e3_3_79_7_H9-fglGASYalxAF2ZY4MmgYRQIgRhWEhEAoAIKAYWiAgAcHBTsrAJdQQIAEAoAjAiBBgCjAgEAAAkASEQASAFggAABEAgABAAgAQgAYGAQWAFgIBAACAaBiAFAAIEgBkQERSmBAVAkEBLZUIJQVSGmEARZYAUAiMgoAEQSAgkAAQFg4BgCQErFggSYgWgAAAAAAAAAAAQAAACAA.f_gACfgAAAAA; ts1=6790da6240c8f99af3c6cc163b872a95b9da5d4f; ____ri=1166; ____lo=PL; fbm_111569915535689=base_domain=.9gag.com; fbsr_111569915535689=LDBzV1yOWk8UPfQIiwM8tAejyvEaFTjvCdIodRwlxRw.eyJ1c2VyX2lkIjoiMzc1MzI3MDc5MTQyOTM3OCIsImNvZGUiOiJBUUJkYW9LT0JJM1NIcjFHOUUzMjYyTGpDVG0wZ1ZhRDFzclZHdmFZQ0UwVXpjdWJyNGhER3NxbFhGZndaMkNtcDNOMDdXQWFRaUl4WVdUeVdic1NqYVlPOFplOTZxSEhCb0NULVpOMWNDeW5DVlJPNklIZVNSYVBYcjl5bjkwLXltVldhS29URUVYVElyWmVlbGhGUEowNlhaOHRvdldqOHZxbnF4bWtJNmhtZTNrWDA1VTBqUUdXVHJLMER4VktLYzk2UnlfejQ3aWpiWkVmeXRoZEdqaFlEXzgtUkc1eTR4eC1JcGVSVHNhM1Y2d0ZadTVFMTZiQjJJRzJ5S0w3dTkzb2QyZHFiTUdOUGw1MGlsMVZmU0lqOGktWnNYNFdWQnZ5V3UyazVKNEo1bk1ES3oxUHBnaUEyRlRQYmRfZlBxT0RrWnZjMkV2bFhqdmZMNEw5dVJWOEVQMWF4WnlCa1hxOEZ0a0FuM3JoUWciLCJvYXV0aF90b2tlbiI6IkVBQUJsZU9VdTRVa0JBTUFhSDMwbFpCN0xDQzY2eHdUR001cUcyMHZoWkFtZklaQk1JMTJaQVFqRkdiTEdwNlR0dWJ6YlVOSDVkN01jd2xaQkxGQ2VCZTJhNXpkS3RiV0xNdVlhWkNldkJqSmFraDR1WkMzWkEzcXBBclNNYUZOOXRFNVZVVE1ucFJYWEE4TDVsTE9VMXA1dGlHYVpBSnNjUkxKMmlITFpBTFJDcVJaQm40VWpnRlJ5cGltbFpDNUdUd0FZWkJVOFpEIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE2ODA3MTQ0ODB9",
      Referer: "https://9gag.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch 9gag posts: " + response.statusText);
  }

  return (await response.json()) as Promise<The9GagPostsResponse>;
}

async function fetchAllMemesFor(
  type: "top" | "home",
  nextCursor?: string,
  memes?: The9GAGPost[],
): Promise<{ memes: The9GAGPost[]; nextCursor?: string }> {
  console.log(`### Current ${type} count: `, memes?.length);

  if (!memes?.length) {
    const firstData = await fetchPosts(type);
    const memes: The9GAGPost[] = [];
    memes.push(...firstData.data.posts);

    return fetchAllMemesFor(type, firstData.data.nextCursor, memes);
  }

  // recursively fetch the next 1000 memes
  if (memes.length < POSTS_LIMIT) {
    const nextData = await fetchPosts("top", nextCursor);
    memes.push(...nextData.data.posts);

    return fetchAllMemesFor(type, nextData.data.nextCursor, memes);
  }

  return { memes, nextCursor };
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const [topMemes, homeMemes] = await Promise.allSettled([
    await fetchAllMemesFor("top"),
    await fetchAllMemesFor("home"),
  ]);

  if (topMemes.status === "rejected" || homeMemes.status === "rejected") {
    return res.status(500).json({ success: false });
  }

  const allMemesDictionary = chain([
    ...topMemes.value.memes,
    ...homeMemes.value.memes,
  ])
    .keyBy((i) => i.id)
    .value();

  let allWithComments: Record<string, The9GAGPostWithComments> = {};

  try {
    allWithComments = (await async.mapValuesLimit<
      The9GAGPost,
      The9GAGPostWithComments
    >(allMemesDictionary, 10, (meme, _key, callback) => {
      fetchComments({
        memeId: meme.id,
        type: "hot",
      })
        .then((commentsResponse) => {
          callback(null, {
            ...meme,
            comments: commentsResponse.payload.comments,
          });
        })
        .catch((err) => {
          callback(err);
        });
    })) as unknown as Record<string, The9GAGPostWithComments>;
  } catch (err) {
    console.log(err);
  }

  const commonComments: ScrappedCommentDB[] = Object.values(allWithComments)
    .map((gagPost): ScrappedCommentDB[] => {
      const theBestThree = gagPost.comments
        .slice()
        .sort((a, b) => {
          // highest like count first
          return b.likeCount - a.likeCount;
        })
        .slice(0, 3);

      return theBestThree.map((comment): ScrappedCommentDB => {
        return {
          id: comment.commentId,
          refTitle: gagPost.title,
          body: comment.text,
          sourceUrl: gagPost.url,
          sourceDomain: "9gag",
          children: [],
          creationTs: comment.timestamp,
          upVoteCount: comment.likeCount,
          mediaUrl: comment.media?[0]
            ? comment.media[0]?.imageMetaByType.image.url
            : undefined,
        };
      });
    })
    .flat();

  try {
    fs.writeFileSync(makeTargetPath(), JSON.stringify(commonComments), "utf8");
  } catch (error) {
    console.log(error);
  }

  console.log("9GAG SCRAP: FINISHED!");

  return res.status(200).json({ success: "true asd" });
}

function makeTargetPath() {
  return path.join(__dirname, "..", "..", "..", "..", "db", `9gag.json`);
}
