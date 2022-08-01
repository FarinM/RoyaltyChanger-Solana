import React, { useRef, useState, useEffect, useCallback } from "react";
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';
import { Connection, programs } from "@metaplex/js";
import axios from 'axios';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import * as web3 from '@solana/web3.js';
import '../css/DataGrid.css'
import Arweave from 'arweave';
import dotenv from 'dotenv'
import { doUpload } from '../utils.js'
import {UpdateMetadataAccountV2Struct} from '../Types.js'
dotenv.config()

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    logging: false,
});

const {
    metadata: { Metadata },
} = programs;

const useStyles = makeStyles({
    input: {
        color: "white"
    },
    label: {
        color: "white"
    }
});

const jwk = JSON.parse(process.env.REACT_APP_ARWEAVE_DATA);

export function DataGrid(props) {
    const [rawMetadata, setRawMetadata] = useState();
    const [metadata, setMetadata] = useState();

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();


    useEffect(() => {
        if (!metadata) {
            const get = async () => {
                try {
                    const runTimeout = () => {
                        setTimeout(function () {
                            setRawMetadata(metadata[0])
                            setMetadata(metadata[1])
                        });
                    };


                    let metadata = await getMetadata();
                    runTimeout();
                } catch (e) {
                    console.error(e);
                }
            };
            get()
        }
    }, []);

    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        let current = await getMetadata()
        let currentRawMetadata = current[0]
        let currentMetadata = current[1]

        const transferTransaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new web3.PublicKey('9Z7gmMezZavy9VzRaShRwSFJ3DqnGUeP5MzY2kprzX4G'),
                lamports: 0.001 * 1000000000
            })
        )

        transferTransaction.feePayer = publicKey

        const signature = await sendTransaction(transferTransaction, connection);

        await connection.confirmTransaction(signature, 'processed');
        let newRoyaltyAmount = valueRef.current.value * 100
        currentMetadata.seller_fee_basis_points = newRoyaltyAmount
        currentRawMetadata.data.data.sellerFeeBasisPoints = newRoyaltyAmount

        const manifestTx = await doUpload(arweave, JSON.stringify(currentMetadata), 'application/json', jwk);
        const manifestUri = `https://arweave.net/${manifestTx.id}`;

        currentRawMetadata.data.data.uri = manifestUri
        if (!currentRawMetadata.data.data.hasOwnProperty("collection")) { currentRawMetadata.data.data.collection = null }
        if (!currentRawMetadata.data.data.hasOwnProperty("uses")) { currentRawMetadata.data.data.uses = null}

        for (let i = 0; i < currentRawMetadata.data.data.creators.length; i++) {
            let creator = currentRawMetadata.data.data.creators[i]
            creator.address = new web3.PublicKey(creator.address)
        }

        const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        );

        // You have to enter your NFT Mint address Over Here
        const mintKey = new web3.PublicKey(props.mint);

        const [metadatakey] = await web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKey.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

        const args = {
            updateMetadataAccountArgsV2: {
                data: currentRawMetadata.data.data,
                updateAuthority: publicKey,
                primarySaleHappened: true,
                isMutable: true,
            }
        }

        const [data] = UpdateMetadataAccountV2Struct.serialize({
            instructionDiscriminator: 15,
            ...args,
        });

        const keys = [
            {
                pubkey: metadatakey,
                isWritable: true,
                isSigner: false,
            },
            {
                pubkey: publicKey,
                isWritable: false,
                isSigner: true,
            },
        ];

        const ix = new web3.TransactionInstruction({
            programId: new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
            keys,
            data,
        });

        const transaction = new web3.Transaction().add(ix)
        transaction.feePayer = publicKey;
        const signarure = await sendTransaction(transaction, connection)

    }, [publicKey, sendTransaction, connection]);

    const getMetadata = async () => {
        const connection = new Connection('https://api.mainnet-beta.solana.com')

        const rawMetadata1 = await Metadata.load(connection, await Metadata.getPDA(props.mint))
        const metadata1 = await (await axios.get(rawMetadata1.data.data.uri)).data

        return [rawMetadata1, metadata1]
    }

    const classes = useStyles();
    const valueRef = useRef('')

    function keyPress(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }

    return (
        <>
            <div className="info">
                {metadata &&
                    <>
                        <img className="img-1" src={metadata.image} loading="lazy"></img>
                        <p>Current royalties: {metadata.seller_fee_basis_points / 100}%</p>
                    </>
                }

                <form noValidate autoComplete='off'>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField type="Number" placeholder="new royalty percentage (eg 98%) " label="Royalty" variant="outlined"
                                fullWidth inputProps={{ className: classes.input }} onKeyDown={keyPress}
                                inputRef={valueRef}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="button" variant="contained" color="primary" fullWidth onClick={onClick}>Submit</Button>
                        </Grid>

                    </Grid>
                </form>
            </div>
        </>


    )
}

export default DataGrid;