import React, { useMemo } from "react";
import "./css/App.css";

import { createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js";
import MyWallet from "./MyWallet";
import InputBox from './components/InputBox'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

require('@solana/wallet-adapter-react-ui/styles.css');

function App() {

  return (
    <header className="App-header">
      <Context>
        <Content />
      </Context>
    </header>
  );
}

export default App;

const Context = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        appIdentity: { name: 'Solana Create React App Starter App' },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div className="button-wrapper">
          <WalletModalProvider>{children}</WalletModalProvider>
        </div>
        <InputBox />
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content = () => {
  return (
    <div className="App">
      <WalletMultiButton />
    </div>
  );
};
