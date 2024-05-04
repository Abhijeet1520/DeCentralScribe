import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="shadow-md rounded-md card">
      <h1 className="text-xl font-bold mb-2">{post?.title}</h1>
      <span className="text-sm text-gray-600">
        Written by{" "}
        <Link href={`/${post.username}/`} legacyBehavior>
          <a className="text-blue-500">@{post.username}</a>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown className="mt-4">{post?.content}</ReactMarkdown>
    </div>
  );
}
