// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthCheck, HeartButton, PostContent } from "../../components";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from "../../styles/Post.module.css";
import { useRouter } from "next/router";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import axios from "axios";
import { FaHeart, FaCoins } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";

interface IPost {
  heartCount?: number;
}

function PostPage() {
  const [post, setPost] = useState(null);
  const [postRef, setPostRef] = useState(null);

  const router = useRouter();
  const username = router.query.username;
  const slug = router.query.slug;

  const [showSupportModal, setShowSupportModal] = useState(true); // State to control the support modal visibility
  console.log(showSupportModal,"showsupport")

  const toggleSupportModal = () => setShowSupportModal(!showSupportModal);

  async function mintSupportercNFT() {
    const Tags = post.tags;

    console.log(Tags,"tags")
    const descr = post.description;
    const cnftimg = post.imageUrl;

    // call the contract with these parameters
    
    // "name": "name ",
    // "description": descr,
    // "image": cnftimg,
    //  "trait_type": "supporters nft",
    //  "trait_type":  Tags[0],
    //  "trait_type": Tags[1],
    //  "external_url": `https://decentral-scribe.vercel.app/${post?.username}/${post?.slug}`,
  
  }

  console.log(username, slug)

  useEffect(() => {
    const fetchPostData = async () => {
      if (!username || !slug) return; // Ensure we have the necessary data to proceed.

      const userDoc = await getUserWithUsername(username);
      if (userDoc) {
        const postRefTemp = userDoc.ref.collection("posts").doc(slug);
        const post = postToJSON(await postRefTemp.get());
        setPost(post);
        // eslint-disable-next-line

        setPostRef(postRefTemp);
      }
    };

    fetchPostData();
  }, [username, slug]);

  const [realtimePost] = useDocumentData<IPost>(postRef); // Hook to listen to real-time data

  const finalPost = realtimePost || post; // Use realtime data if available, otherwise use statically fetched data

  if (!finalPost) {
    return <div>Loading...</div>; // Or any other loading state
  }


  return (
    <main className="flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative">
      <section className="w-full">
        <PostContent post={finalPost} />
        {!showSupportModal && (
          <Modal onClose={toggleSupportModal}>
            <h2 className="text-lg font-semibold mb-4">Please support the author through this modal</h2>
            {/* Other modal content here */}
          </Modal>
        )}
      </section>
      <div className="fixed bottom-4 left-0 right-0 bg-gray-800 px-4 shadow-lg shadow-gray-800 w-[80%] max-w-3xl m-auto rounded-lg">
        <div className="flex justify-between items-center mx-auto">
        <p>
          <span className="flex items-center">
            <strong>{finalPost?.heartCount || 0}</strong>
            <FaHeart color="red" className="ml-2" />
          </span>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button className="btn-blue">Sign Up</button>
            </Link>
          }
        >
          {postRef && <HeartButton postRef={postRef} />}
        </AuthCheck>
          <button
            onClick={toggleSupportModal}
            className="btn-blue"
          >
            <FaGift className="mr-2" />
            Support the Author
          </button>
          <button
            onClick={mintSupportercNFT}
            className="btn-blue"
          >
            <FaCoins className="mr-2" />
            Mint Supporter cNFT
          </button>
        </div>
      </div>
    </main>
  );
}

export default PostPage;
