"use client";
import { Navbar } from "../components";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import "../styles/globals.css";
import {
  ThirdwebProvider,
} from "thirdweb/react";


if (typeof window !== "undefined") {
  import("react-indexed-db-hook").then(({ initDB }) => {
    initDB({
      name: "worldcoin",
      version: 2,
      objectStoresMeta: [
        {
          store: "worldcoin",
          storeConfig: { keyPath: "id", autoIncrement: true },
          storeSchema: [
            { name: "proof", keypath: "proof", options: { unique: false } },
            { name: "merkle_root", keypath: "merkle_root", options: { unique: false } },
            { name: "nullifier_hash", keypath: "nullifier_hash", options: { unique: false } },
          ],
        },
      ],
    })
  })
}


function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <ThirdwebProvider>
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
    </ThirdwebProvider>
  );
}

export default MyApp;
