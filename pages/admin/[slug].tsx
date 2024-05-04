import { useState } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import { AuthCheck, ImageUploader } from "../../components";

import styles from "../../styles/Admin.module.css";

type PostType = {
  title: string;
  slug: string;
  username: string;
};

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug as string);
  const [post] = useDocumentData<PostType>(postRef);

  return (
    <main className="container mx-auto px-4">
      {post && (
        <div className="flex flex-wrap">
          <section className="w-full lg:w-3/4 pr-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-gray-600">ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside className="w-full lg:w-1/4">
            <h3 className="text-xl font-semibold mb-2 text-center">Tools</h3>
            <button
              className="btn-blue px-4 py-2 rounded-md mb-2 w-full"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue px-4 py-2 rounded-md w-full">
                Live View
              </button>
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState, errors } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });
    reset({ content, published });
    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)} className="mt-4">
      {preview && (
        <div className="card rounded-lg p-4 mb-4">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? "hidden" : ""}>
        <ImageUploader />
        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: "Content is too long" },
            minLength: { value: 10, message: "Content is too short" },
            required: { value: true, message: "Content is required" },
          })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        ></textarea>
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
        <fieldset className="mb-4">
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          />
          <label>Published</label>
        </fieldset>
        <button
          type="submit"
          className={`btn-green px-4 py-2 rounded-md ${
            (!isValid) && "opacity-50 cursor-not-allowed"
          }`}
          // disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
