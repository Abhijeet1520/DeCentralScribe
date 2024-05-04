"use client";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import { AuthCheck, ImageUploader } from "../../components";
import axios from "axios";
import styles from "../../styles/Admin.module.css";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useActiveAccount } from "thirdweb/react";

type PostType = {
  title: string;
  slug: string;
  username: string;
  description?: string;
};

interface FormInputs {
  content: string;
  description: string;
  published: boolean;
  imageUrl?: string;
}

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
  const [tags, setTags] = useState<string[]>([]);

  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug as string);
  const [post] = useDocumentData<PostType>(postRef);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e : any) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success("Image selected");
    }
  };


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
            <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer">
              📸 Upload NFT Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            </label>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview, tags, setTags }) {
  const { register, handleSubmit, reset, watch, formState, errors  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl || '');

  const wallet = useActiveAccount();
  const address = wallet?.address;

  const updatePost = async ({ content, published , description}: FormInputs) => {
    await postRef.update({
      content,
      description,
      published,
      imageUrl,
      updatedAt: serverTimestamp(),
      address,
      tags
    });
    reset({ content, published , description, tags});
    
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
        <input
          name="img"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <label className="label">
          <span className="label-text text-xl">Description</span>
        </label>
        <textarea
          name="description"
          ref={register({
            maxLength: { value: 20000, message: "description is too long" },
            minLength: { value: 10, message: "description is too short" },
            required: { value: true, message: "description is required" },
          })}
          placeholder="Description..."
        ></textarea>
        <div>
          <input
            name="tagInput"
            type="text"
            className="my-6"
            placeholder="Enter a tag and press enter"
            onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
              e.preventDefault(); // Prevent form submission
              const newTag = e.currentTarget.value.trim();
              if (!tags.includes(newTag) && tags.length < 4) { // Limit to 4 tags, adjust as needed
                setTags([...tags, newTag]);
              }
              e.currentTarget.value = ''; // Clear input
            }
          }}
          />
          <div>Tags: {tags.join(', ')}</div>
          <button onClick={() => setTags([])}>Clear tags</button>
        </div>
        <label className="label">
          <span className="label-text text-xl">Content</span>
        </label>
        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: "Content is too long" },
            minLength: { value: 10, message: "Content is too short" },
            required: { value: true, message: "Content is required" },
          })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          placeholder="Write your post content here..."
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