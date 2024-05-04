import { firestore, auth, increment } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { FaHeartBroken, FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";

const HeartButton = ({ postRef }) => {
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);
  const [isHovered, setIsHovered] = useState(false);

  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button className="btn-blue text-xs xl:text-sm sm:p-3 md:p-4" onClick={removeHeart} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {isHovered ? <><FaHeartBroken color="red" className="mr-2" /> Unheart</> : <><FaHeart color="red" className="mr-2" /> Hearted</>}
    </button>
  ) : (
    <button className="btn-blue text-xs xl:text-sm sm:p-3 md:p-4" onClick={addHeart}>
      <FaRegHeart color="red" className="mr-2" /> Heart
    </button>
  );
};

export default HeartButton;
