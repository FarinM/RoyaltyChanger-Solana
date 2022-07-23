import React from 'react';
import {
    WalletModalProvider,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import './css/MyWallet.css'

const MyWallet = () => {

    return (
        <>
            <div className="multi-wrapper">
                <span className="button-wrapper">
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                </span>
            </div>
        </>
    );
};

export default MyWallet;
