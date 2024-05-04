// @ts-nocheck
"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

import { FaBars } from "react-icons/fa";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        options: ["email", "google"],
      },
    }),
  ];

  return (
    <nav className="bg-gray-800 py-4 sticky top-0 z-[999]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <button className="btn-logo">DeCentralScribe</button>
        </Link>
        <div className="flex items-center space-x-4">
          {username && (
            <>
              <button
                className="text-white p-3 lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaBars />
              </button>
              <ul className={`flex items-center space-x-4 ${isMenuOpen ? 'flex-col' : 'hidden lg:flex'}`}>
                <li>
                  <button onClick={signOut} className="btn-red text-white p-3">
                    Sign Out
                  </button>
                </li>
                <li>
                  <Link href="/admin">
                    <button className="btn-blue p-3">Write Posts</button>
                  </Link>
                </li>
                <li>
                  <Link href={`/${username}`}>
                    <img
                      src={user?.photoURL}
                      alt={user?.photoURL}
                      className="h-12 w-12 rounded-full"
                    />
                  </Link>
                </li>
                <li>
                  <ConnectButton
                    client={client}
                    wallets={wallets}
                    theme={"dark"}
                    connectModal={{ size: "wide", showThirdwebBranding: false }}
                  />
                </li>
                <li>
                  <WorldIdWidget signal="2024" />
                </li>
              </ul>

            </>
          )}
          {!username && (
            <Link href="/enter">
              <button className="btn-blue">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
