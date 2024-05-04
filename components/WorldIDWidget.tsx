import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti"; // Import the tick icon

// Define Props type
type Props = {
  signal: string;
  onProofGenerated?: (proof: {
    merkle_root: string;
    nullifier_hash: string;
    proof: string;
  }) => void;
};

// Define the component
export const WorldIdWidget = ({ signal, onProofGenerated }: Props) => {

  const isBrowser = typeof window !== 'undefined';

  const [hasEntry, setHasEntry] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // State to track if verified

  if (hasEntry) {
    return <p>You have already verified with World ID</p>;
  }
  useEffect(() => {
    // Check if user is already verified by checking localStorage
    const isVerifiedInLocalStorage = localStorage.getItem("worldIdVerified");
    if (isVerifiedInLocalStorage) {
      setIsVerified(true);
    }
  }, []);

  // If not yet verified, render the IDKitWidget
  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
      action={process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID}
      signal={signal}
      onSuccess={(proofResult) => {
        console.log("debug::onSuccess", JSON.stringify(proofResult));
        const { proof, merkle_root, nullifier_hash } = proofResult;

        // Save verification status in localStorage
        localStorage.setItem("worldIdVerified", "true");
        localStorage.setItem("worldIdproofResult", JSON.stringify(proofResult));
        setIsVerified(true); // Update state to reflect verification

        toast.success("Successfully verified with World ID");
      }}
      handleVerify={(proof) => {
        console.log("debug::handleVerify", JSON.stringify(proof), onProofGenerated);
        onProofGenerated && onProofGenerated(proof);
      }}
      verification_level={VerificationLevel.Device}
    >
      {({ open }) => (
        <button className="btn-blue border border-black rounded-md" onClick={open}>
          <div className="mx-2 my-1">
            {isVerified ? <span className="flex items-center"><TiTick className="text-green-500 mr-1" /> <span>Verified</span></span> : "Verify with World ID"}
            </div>
        </button>
      )}
    </IDKitWidget>
  );
};
