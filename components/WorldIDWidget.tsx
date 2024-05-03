window.global ||= window;
import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
// import { useState } from "react";
import { useIndexedDB } from 'react-indexed-db-hook';

const WORLD_ID_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID!;
const WORLD_ID_ACTION_ID = process.env.NEXT_PUBLIC_WLD_ACTION!;
// const VERIFIER_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDR!;

type Props = {
  signal: string;
  onProofGenerated?: (proof: {
    merkle_root: string;
    nullifier_hash: string;
    proof: string;
  }) => void;
};

export const WorldIdWidget = ({ signal, onProofGenerated }: Props) => {

 const isBrowser = typeof window !== 'undefined';

  const db = useIndexedDB('worldcoin');
  const [hasEntry, setHasEntry] = useState(false);
  // const [proof, setProof] = useState<unknown>(null);

  // console.log("proof", proof);
  // console.log("VERIFIER_CONTRACT_ADDRESS", VERIFIER_CONTRACT_ADDRESS);


  useEffect(() => {
    if (isBrowser) {
      db.getAll().then((wc) => {
        setHasEntry(wc.length > 0);
      });
    }
  }, [db]);

  if (hasEntry) {
    return (
      <p>You have already verified with World ID</p>
    );
  }

  if (!isBrowser) {
    return null; // or appropriate fallback for server-side rendering
  }

  return (
    <IDKitWidget
      app_id={WORLD_ID_APP_ID as `app_${string}`}
      action={WORLD_ID_ACTION_ID}
      signal={signal}
      onSuccess={(proofResult) => {
        console.log("debug::onSuccess", JSON.stringify(proofResult));
        const { proof, merkle_root, nullifier_hash } = proofResult;

        db.add({ proof, merkle_root, nullifier_hash });
      }}
      handleVerify={(proof) => {
        console.log("debug::handleVerify", JSON.stringify(proof));
        onProofGenerated && onProofGenerated(proof);
        // setProof(proof);
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