// @ts-nocheck
"use client";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

import { sepolia } from "thirdweb/chains";
import {
  createWallet,
  walletConnect,
  inAppWallet,
} from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { WorldIdWidget } from "./WorldIDWidget";

function Navbar() {
  const { username, user } = useContext(UserContext);

  const router = useRouter();

  const signOut = () => {
    auth.signOut();
    router.reload();
  };


  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  });
  
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
      auth: {
        options: [
          "email",
          "google",
        ],
      },
    }),
  ];
  

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">DSCRIBE</button>
          </Link>
        </li>
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOut}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} alt={user?.photoURL} />
              </Link>
            </li>
            <li>
            <ConnectButton
              client={client}
              wallets={wallets}
              theme={"dark"}
              connectModal={{ size: "wide", showThirdwebBranding: false,}}
            />
            </li>
            <li>
            <WorldIdWidget signal="2024" />
            </li>
          </>
        )}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
