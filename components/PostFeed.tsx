import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";

// eslint-disable-next-line
function PostItem({ post, admin }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <article className="rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={`https://source.unsplash.com/random?cool-article-background${Math.floor(Math.random() * (100))}`}
          alt="Blog post image"
          width="400"
          height="300"
          className="h-full w-full object-cover"
          style={{ aspectRatio: "400 / 300", objectFit: "cover" }}
        />
      </div>
      <div className="px-4">
        <h2 className="mb-2 text-xl font-bold">
          <Link href={!admin ? `/${post.username}/${post.slug}` : `/admin/${post.slug}`} legacyBehavior>
            <h2 className="mt-2 text-xl hover:text-blue-500 dark:hover:text-blue-400">
              <a>{post.title}</a>
            </h2>
          </Link>
        </h2>
        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link href={`/${post.username}`} legacyBehavior>
            <a className="text-indigo-600 hover:text-indigo-800 font-semibold mr-2">
              <strong>@{post.username} </strong>
            </a>
          </Link>
          <span className="mx-2">•</span>
          <span>May 3, 2024</span>
        </div>
        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-2">{wordCount} words</span>
          <span className="mx-2">•</span>
          <span>{minutesToRead} min read</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            {post.tags.map((tag : string, index: number) => (
              <div key={index} className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mr-2">
                #{tag}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between">
          <button className="font-medium gap-2 hover:bg-blue-500 items-center px-4 rounded-md text-sm transition-colors">
            <FaRegHeart className="h-4 w-4" />
            <span>{post.heartCount} likes</span>
          </button>
          <div className="font-medium gap-2 items-center px-4 rounded-md text-sm transition-colors flex">
            <a className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500" href="#">
              Read more
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// eslint-disable-next-line
const PostFeed = ({ posts, admin }) => {
  if (!posts) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* eslint-disable-next-line  */}
      {posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </div>
  );
};

export default PostFeed;
