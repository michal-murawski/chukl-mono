import type { The9GAGComment } from "~/pages/api/crones/scrapper/comments-types";
import type { The9GAGPost } from "~/pages/api/crones/scrapper/posts-types";

export type ScrappedCommentDB = {
  id: string;
  refTitle: string;
  body: string;
  sourceUrl: string;
  sourceDomain: "9gag" | string;
  children: Omit<ScrappedCommentDB, "children">[];
  creationTs: number;
  upVoteCount: number;
  mediaUrl?: string;
};

export type The9GAGPostWithComments = The9GAGPost & {
  comments: The9GAGComment[];
};
