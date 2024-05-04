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
interface IPost {
  heartCount?: number;
}

function PostPage() {
  const [post, setPost] = useState(null);
  const [postRef, setPostRef] = useState(null);

  const router = useRouter();
  console.log(router,"router");

  const username = router.query.username;
  const slug = router.query.slug;

  const addr = "6cVCyRQhd2oZoVukbmngTuXSBtoogHR4NLsgQhydMU1R";
  const [metadatauri,setMetadatauri] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(true); // State to control the support modal visibility
  console.log(showSupportModal,"showsupport")

  const toggleSupportModal = () => setShowSupportModal(!showSupportModal);

  async function mintSupportercNFT() {
    const formData = new FormData();
    const Tags = post.tags;

    console.log(Tags,"tags")
    const descr = post.description;
    const cnftimg = post.imageUrl;
    console.log(cnftimg,"img")


    var raw = JSON.stringify({
      "name": "SOLQUILL Supporters NFT",
      "symbol": "SOLQUILL SNFT",
      "description": descr,
      "image": cnftimg,
      "attributes": [
        {
          "trait_type": "type",
          "value": "supporters nft from SOlQuill"
        },
        {
          "trait_type": "tag0",
          "value": Tags[0],
        },
        {
          "trait_type": "tag1",
          "value": Tags[1],
        }
      ],
      "royalty": 5,
      "creator": addr,
      "share": 100,
      "external_url": `https://decentral-scribe.vercel.app/${post?.username}/${post?.slug}`,
      "files": []
    });

    console.log(raw,"raw")
    
    var requestOptions = {
      method: 'POST',
      headers: {
        "x-api-key": `${process.env.NEXT_PUBLIC_SHYFT_API}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: raw,
    };
    
    axios.post("https://api.shyft.to/sol/v1/metadata/create", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .then(result => setMetadatauri(result!))
      .catch(error => console.log('error', error));

  

    formData.append("network", 'devnet');
    formData.append("creator_wallet", addr);
    formData.append("merkle_tree", "AypA8d5MJBp9SV7DRsdrt8g5dWyY3Ji44tPKAgvYBwmc")
    formData.append("metadata_uri", metadatauri);
    formData.append("fee_payer", addr!);
    formData.append("max_supply", '1');
    
    axios.post('https://api.shyft.to/sol/v1/nft/compressed/mint', formData, {
      headers: {
        "x-api-key": `${process.env.NEXT_PUBLIC_SHYFT_API}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log(response.data);
        const encodedTransaction =response.data.result.encoded_transaction;
        toast.success("Transaction generated successfully");

       
        (async () => {
          try {

          } catch (error) {
            console.log(error);
          }
        })();
      })
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
    <main className={styles.container}>
      <section>
        <PostContent post={finalPost} />
        {!showSupportModal && (
          <>
        <Modal onClose={toggleSupportModal}>
          {/* @ts-ignore */}
          <h2>Please support the author thr this modal</h2>

          
        </Modal>
        </>
        )}
      </section>
      <aside>
      <div className="card">
        <p>
          <strong>{finalPost?.heartCount || 0} ❤️</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/login" passHref>
              <button>Sign Up</button>
            </Link>
          }
        >
          {postRef && <HeartButton postRef={postRef} />}
        </AuthCheck>
        <button type="button" onClick={toggleSupportModal} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-scrollable-modal">
         Support the Author
       </button>

       <button type="button" onClick={mintSupportercNFT} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-vertically-centered-scrollable-modal">
         Mint the Supporter cNFT
       </button>


      </div>
      </aside>
    </main>
  );
}

export default PostPage;