export type The9GagResponse = {
  meta: Meta;
  data: Data;
};

export type Data = {
  posts: MemePost[];
  tags: any[];
  nextCursor: string;
};

export type MemePost = {
  id: string;
  url: string;
  title: string;
  description: string;
  type: Type;
  nsfw: number;
  upVoteCount: number;
  downVoteCount: number;
  creationTs: number;
  promoted: number;
  isVoteMasked: number;
  hasLongPostCover: number;
  images: Images;
  sourceDomain: string;
  sourceUrl: string;
  creator: Creator | null;
  isAnonymous: boolean;
  commentsCount: number;
  comment: Comment;
  postSection: PostSection;
  tags: Tag[];
  annotationTags: string[];
};

export type Comment = {
  listType: ListType;
  updateTs: number;
  latestCommentText: string;
  opToken: string;
  canAnonymous: boolean;
  pinnedCommentCount: number;
};

export type ListType = "comment";

export type Creator = {
  userId: string;
  accountId: string;
  username: string;
  fullName: string;
  emojiStatus: string;
  about: string;
  avatarUrl: string;
  profileUrl: string;
  isActivePro: boolean;
  isActiveProPlus: boolean;
  isVerifiedAccount: boolean;
  creationTs: number;
  activeTs: number;
  preferences: Preferences;
};

export type Preferences = {
  hideProBadge: number;
  hideActiveTs: number;
  accentColor: string;
  backgroundColor: string;
};

export type Images = {
  image700: Image;
  image460: Image;
  imageFbThumbnail: Image;
  image460sv?: Image460Sv;
};

export type Image = {
  width: number;
  height: number;
  url: string;
  webpUrl?: string;
};

export type Image460Sv = {
  width: number;
  height: number;
  url: string;
  hasAudio: number;
  duration: number;
  vp8Url: string;
  h265Url: string;
  vp9Url?: string;
  av1Url: string;
};

export type PostSection = {
  name: string;
  url: string;
  imageUrl: string;
};

export type Tag = {
  key: string;
  url: string;
};

export type Type = "Animated" | "Photo";

export type Meta = {
  timestamp: number;
  status: string;
  sid: string;
};
