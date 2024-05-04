import { firestore, auth, increment } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { FaHeartBroken, FaRegHeart, FaHeart } from "react-icons/fa";

const HeartButton = ({ postRef }) => {
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

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
    <button className="btn-blue" onClick={removeHeart}><FaHeartBroken color="red" className="mr-2"/> Unheart</button>
  ) : (
    <button className="btn-blue" onClick={addHeart}><FaHeart color="red" className="mr-2"/>Heart</button>
  );
};

export default HeartButton;
