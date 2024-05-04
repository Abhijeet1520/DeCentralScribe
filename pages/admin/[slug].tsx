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
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            
            <PostForm postRef={postRef} defaultValues={post} preview={preview} tags={tags} setTags={setTags} />
          </section>
          <aside>
            <div className="card">
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)} className="text-black text-xl bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900">
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xl px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Live view</button>
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
        </>
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
  const updatePost = async ({ content, published , description}: FormInputs) => {
    await postRef.update({
      content,
      description,
      published,
      imageUrl,
      updatedAt: serverTimestamp(),
      publicaddr: wallet?.address,
      tags
    });
    reset({ content, published , description, tags});
    
    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
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
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
          placeholder="Write your post content here..."
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
        <fieldset>
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
          className="btn-green"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}