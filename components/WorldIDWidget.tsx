import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState } from "react";

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
  // Check if window is defined
  const isBrowser = typeof window !== 'undefined';

  // Define state variable to track if the user has an entry in indexedDB
  const [hasEntry, setHasEntry] = useState(false);

  useEffect(() => {
    // Asynchronously import useIndexedDB hook
    import("react-indexed-db-hook").then(({ useIndexedDB }) => {
      // Use useIndexedDB hook directly inside the component
      const db = isBrowser ? useIndexedDB('worldcoin') : null;

      // Execute only in the browser environment
      if (isBrowser && db) {
        db.getAll().then((wc) => {
          setHasEntry(wc.length > 0);
        });
      }
    });
  }, [isBrowser]);

  // Conditional rendering based on whether the user has already verified
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

        // Asynchronously import useIndexedDB hook
        import("react-indexed-db-hook").then(({ useIndexedDB }) => {
          // Use useIndexedDB hook directly inside the component
          const db = isBrowser ? useIndexedDB('worldcoin') : null;

          // Add the proof to indexedDB
          if (isBrowser && db) {
            db.add({ proof, merkle_root, nullifier_hash });
          }
        });
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
