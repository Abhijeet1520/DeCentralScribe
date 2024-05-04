// @ts-nocheck
import { HardhatUserConfig } from "hardhat/config";
//import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import { mnemonicToAccount } from "viem/accounts";

require("dotenv").config();

import * as ethers from "ethers";

const mnemonic = process.env.ADMIN_PASSPHRASE ?? ethers.Wallet.createRandom().mnemonic!.phrase;

const wallet = ethers.Wallet.fromPhrase(mnemonic);
const privateKey = wallet.privateKey;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          evmVersion: "paris",
        },
      },
      {
        version: "0.8.19",
        settings: {
          evmVersion: "paris",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
  },
  etherscan: {
    apiKey: {
      snowtrace: "snowtrace",
    },
    customChains: [],
  },
  networks: {
    mantle_testnet: {
      chainId: 5001,
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [privateKey ?? "undefined"],
    },
  },
  defaultNetwork: "mantle_testnet",
};

export default config;
