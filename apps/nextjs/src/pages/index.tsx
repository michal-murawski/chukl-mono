import Image, { type ImageProps } from "next/image";
import { type GetStaticProps } from "next";

import the9GagIcon from "../../public/9gag.svg" assert { type: "image/svg+xml" };

import the9GAGComments from "~/db/9gag.json" assert { type: "json" };
import type { ScrappedCommentDB } from "~/pages/api/crones/scrapper/common-types";
import { useMemo } from "react";

const DomainIcon = (props: Omit<ImageProps, "src">) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image
    priority
    src={the9GagIcon as string}
    height={32}
    width={32}
    {...props}
  />
);

const PostCard: React.FC<{
  post: ScrappedCommentDB;
  onPostDelete?: () => void;
}> = ({ post }) => {
  const date = useMemo(() => {
    return new Date(post.creationTs * 1000).toString().split(" ").slice(1, 4).join(" ");
  }, [post.creationTs]);

  return (
    <article className="mb-6 rounded-lg p-6 text-base dark:bg-gray-700">
      <header className="mb-2 flex flex-column justify-between items-start">
        <div className="flex items-start">
          <p className="mr-3 inline-flex items-center text-sm text-gray-900 dark:text-white">
            <DomainIcon
              className="mr-2 h-6 w-6 rounded-full"
              alt={post.refTitle}
            />
            <a title={post.refTitle} className="break-normal" href={post.sourceUrl} target="_blank">{post.refTitle}</a>
          </p>
          <span
            className="bg-blue-100 text-blue-800 inline-flex text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{post.upVoteCount}</span>
        </div>

        <p className="text-sm flex whitespace-nowrap text-gray-600 dark:text-gray-400">
          <time dateTime={date} title={date}>
            {date}
          </time>
        </p>
      </header>
      <p className="text-gray-500 dark:text-gray-400">
        {post.body}
      </p>
      <div className="mt-4 flex items-center space-x-4">
        {/*<button*/}
        {/*  type="button"*/}
        {/*  className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"*/}
        {/*>*/}
        {/*  <svg*/}
        {/*    aria-hidden="true"*/}
        {/*    className="mr-1 h-4 w-4"*/}
        {/*    fill="none"*/}
        {/*    stroke="currentColor"*/}
        {/*    viewBox="0 0 24 24"*/}
        {/*    xmlns="http://www.w3.org/2000/svg"*/}
        {/*  >*/}
        {/*    <path*/}
        {/*      strokeLinecap="round"*/}
        {/*      strokeLinejoin="round"*/}
        {/*      strokeWidth="2"*/}
        {/*      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"*/}
        {/*    ></path>*/}
        {/*  </svg>*/}
        {/*  Reply*/}
        {/*</button>*/}
      </div>
    </article>
  );
};

type HomeProps = {
  comments: ScrappedCommentDB[];
};

const Home = ({ comments }: HomeProps) => {
  return (
    <>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="https://chuckl.io" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Chuckl</span>
            </a>

          </div>
        </nav>
      </header>
      <main className="py-8 lg:py-16 flex min-h-screen flex-col items-center">

        <div className="container max-w-4xl mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <div className="flex  justify-center px-4 text-2xl">
            <div className="flex w-full flex-col gap-4">
              {comments?.map((p) => {
                return <PostCard key={p.id} post={p} />;
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = () => {
  const typed = the9GAGComments as ScrappedCommentDB[];
  for (let i = typed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = typed[i];
    typed[i] = typed[j] as ScrappedCommentDB;
    typed[j] = temp as ScrappedCommentDB;
  }

  return {
    props: {
      comments: typed.slice(0, 300).filter(
        (c) => c.body && !c.mediaUrl
      )
    },
    revalidate: 60 * 2 // 2 minutes
  };
};

export default Home;
