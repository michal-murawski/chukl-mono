export type The9GagCommentsResponse = {
  status: string;
  error: string;
  payload: Payload;
};

export type Payload = {
  url: string;
  status: string;
  lock: boolean;
  total: number;
  opUserId: string;
  comments: The9GAGComment[];
  prev: null;
  next: string;
  parent: null;
  level: number;
};

export type The9GAGComment = {
  commentId: string;
  level: number;
  mentionMapping: MentionMapping;
  parent: Parent;
  permalink: string;
  text: string;
  threadId: string;
  timestamp: number;
  type: AttachmentType;
  isVoteMasked: number;
  mediaText: string;
  user: User;
  likeCount: number;
  dislikeCount: number;
  isPinned: number;
  childrenTotal: number;
  childrenUrl: string;
  opStatus: number;
  isCollapsed: number;
  isDeleted: number;
  isSensitive: number;
  isOffensive: number;
  media?: Media[];
  attachments?: Attachment[];
};

export type Attachment = {
  type: AttachmentType;
  data: Data;
};

export type Data = {
  type: ClassEnum;
  image: Animated;
  animated?: Animated;
  video?: Animated;
};

export type Animated = {
  width: number;
  height: number;
  url: string;
  webpUrl?: string;
};

export type ClassEnum = "STATIC" | "ANIMATED";

export type AttachmentType = "text" | "userMedia";

export type Media = {
  imageMetaByType: Data;
  sourceMeta: SourceMeta;
  hash: string;
};

export type SourceMeta = {
  accountKey: string;
  key: string;
  type: string;
  class: ClassEnum;
  size: number;
  width: number;
  height: number;
  hash: string;
  url?: string;
};

export type MentionMapping = {
  dummy: string;
};

export type Parent = string;

export type User = {
  userId: string;
  avatarUrl: string;
  displayName: string;
  emojiStatus: string;
  country: string;
  profileUrl: string;
  profileUrls: Record<string, string>;
  timestamp: string;
  permissions: Permissions;
  isActivePro: boolean;
  isActiveProPlus: boolean;
  isVerifiedAccount: boolean;
  accountId: string;
  activeTs: number;
  preferences: Preferences;
};

export type Permissions = {
  "9GAG_Pro"?: number;
  "9GAG_Pro_Plus"?: number;
};

export type Preferences = {
  hideProBadge: number;
  hideActiveTs: number;
  accentColor: AccentColor;
  backgroundColor: string;
};

export type AccentColor = "Orange" | "";
