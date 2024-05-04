import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  if (hasEntry) {
    return <p>You have already verified with World ID</p>;
  }

  // If not yet verified, render the IDKitWidget
  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
      action={process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID}
      signal={signal}
      onSuccess={(proofResult) => {
        console.log("debug::onSuccess", JSON.stringify(proofResult));
        const { proof, merkle_root, nullifier_hash } = proofResult;

        toast.success("Successfully verified with World ID");
      }}
      handleVerify={(proof) => {
        console.log("debug::handleVerify", JSON.stringify(proof));
        onProofGenerated && onProofGenerated(proof);
      }}
      verification_level={VerificationLevel.Device}
    >
      {({ open }) => (
        <button className="border border-black rounded-md" onClick={open}>
          <div className="mx-3 my-1">Verify with World ID</div>
        </button>
      )}
    </IDKitWidget>
  );
};
